// File: src/components/BottomTimer/index.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Keyboard,
  BackHandler,
  Platform,
} from "react-native";
import { styles } from "./style";
import {
  ensureNotificationSetup,
  scheduleRestIn,
  cancelNotification,
} from "../../lib/notifications";

const STORAGE_KEY = "rest-timer@v1";

type Persisted = {
  stopAt: number;
  running: boolean;
  startedAt: number | null; // epoch ms when timer was (last) started
};

export default function BottomTimer() {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [stopAtText, setStopAtText] = useState<string>("90");
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const notifIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  // ----- bootstrap: notifications + persisted state
  useEffect(() => {
    ensureNotificationSetup();

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved: Persisted = JSON.parse(raw);
        if (Number.isFinite(saved.stopAt)) setStopAtText(String(saved.stopAt));
        if (saved.startedAt) {
          startedAtRef.current = saved.startedAt;
          const elapsed = Math.max(
            0,
            Math.floor((Date.now() - saved.startedAt) / 1000)
          );
          setSec(elapsed);
        }
        if (saved.running) {
          setRunning(true);
          const stopAt = Number.isFinite(saved.stopAt) ? saved.stopAt : 0;
          const remaining = Math.max(
            1,
            stopAt -
              Math.floor((Date.now() - (saved.startedAt ?? Date.now())) / 1000)
          );
          notifIdRef.current = (await scheduleRestIn(remaining)) as any;
        }
      } catch {}
    })();
  }, []);

  // ----- tick
  useEffect(() => {
    if (running) {
      if (!startedAtRef.current) {
        startedAtRef.current = Date.now() - sec * 1000;
      }
      intervalRef.current = setInterval(() => {
        setSec(
          Math.max(
            0,
            Math.floor((Date.now() - (startedAtRef.current as number)) / 1000)
          )
        );
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running]);

  // ----- auto-stop at target
  useEffect(() => {
    const target = toPositiveInt(stopAtText);
    if (!running || target <= 0) return;
    if (sec >= target) {
      stopTimer();
    }
  }, [sec, running, stopAtText]);

  // ----- Android back should blur input instead of trapping you
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (inputFocused) {
        inputRef.current?.blur();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [inputFocused]);

  // ----- persistence
  useEffect(() => {
    persistState().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stopAtText]);

  async function persistState() {
    const stopAt = toPositiveInt(stopAtText);
    const payload: Persisted = {
      stopAt,
      running,
      startedAt: running ? startedAtRef.current : null,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }

  function toPositiveInt(v: string) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  async function startTimer() {
    const target = toPositiveInt(stopAtText);
    if (!running) {
      startedAtRef.current = Date.now() - sec * 1000;
      // schedule only if target is valid and in the future
      if (target > sec) {
        await cancelNotification(notifIdRef.current);
        const remaining = Math.max(1, target - sec);
        notifIdRef.current = (await scheduleRestIn(remaining)) as any;
      } else {
        await cancelNotification(notifIdRef.current);
        notifIdRef.current = null;
      }
      setRunning(true);
    }
  }

  async function pauseTimer() {
    if (running) {
      setRunning(false);
      await cancelNotification(notifIdRef.current);
      notifIdRef.current = null;
    }
  }

  async function stopTimer() {
    setRunning(false);
    startedAtRef.current = null;
    await cancelNotification(notifIdRef.current);
    notifIdRef.current = null;
    // fire in-app banner for clarity (system notif already fires)
    // no-op here; expo-notifications handler shows the scheduled notif
  }

  async function resetTimer() {
    await pauseTimer();
    setSec(0);
    startedAtRef.current = null;
  }

  async function onToggle() {
    if (running) await pauseTimer();
    else await startTimer();
  }

  async function applyPreset(seconds: number) {
    setStopAtText(String(seconds));
    if (running) {
      await cancelNotification(notifIdRef.current);
      const remaining = Math.max(1, seconds - sec);
      notifIdRef.current = (await scheduleRestIn(remaining)) as any;
    }
  }

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Text style={styles.time}>
        {mm}:{ss}
      </Text>

      <View style={styles.inputWrap}>
        <Text style={{ color: "#fff" }}>Stop at (sec)</Text>
        <TextInput
          ref={inputRef}
          value={stopAtText}
          onChangeText={setStopAtText}
          onFocus={() => setInputFocused(true)}
          onBlur={() => {
            setInputFocused(false);
            if (!toPositiveInt(stopAtText)) setStopAtText("90");
          }}
          keyboardType="number-pad"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => Keyboard.dismiss()}
          placeholder="90"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
        />
        <Pressable onPress={() => inputRef.current?.blur()}>
          <Text style={{ color: "#fff" }}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.pillRow}>
        {[60, 90, 120].map((p) => (
          <Pressable key={p} onPress={() => applyPreset(p)} style={styles.pill}>
            <Text style={styles.pillText}>{p}s</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Pressable onPress={onToggle}>
          <Text style={{ color: "#fff" }}>{running ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable onPress={resetTimer}>
          <Text style={{ color: "#fff" }}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

// AsyncStorage import kept at bottom to avoid cycles in some bundlers
import AsyncStorage from "@react-native-async-storage/async-storage";
