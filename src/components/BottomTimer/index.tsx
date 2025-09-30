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
  cancelAllScheduled,
} from "../../lib/notifications";

export default function BottomTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [stopAtText, setStopAtText] = useState("90");
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    ensureNotificationSetup();
  }, []);

  useEffect(() => {
    if (running) {
      if (!startedAtRef.current)
        startedAtRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        const e = Math.max(
          0,
          Math.floor((Date.now() - (startedAtRef.current as number)) / 1000)
        );
        setElapsed(e);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running]);

  useEffect(() => {
    const target = toInt(stopAtText);
    if (!running || target <= 0) return;
    if (elapsed >= target) {
      stopTimer();
    }
  }, [elapsed, running, stopAtText]);

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

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  function toInt(v: string) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  async function applyStopAt() {
    const n = toInt(stopAtText);
    if (n <= 0) setStopAtText("90");
    if (running) {
      await cancelAllScheduled();
      const remaining = n - elapsed;
      if (remaining >= 1) await scheduleRestIn(remaining);
    }
    inputRef.current?.blur();
    Keyboard.dismiss();
  }

  async function startTimer() {
    if (running) return;
    const target = toInt(stopAtText);
    startedAtRef.current = Date.now() - elapsed * 1000;
    await cancelAllScheduled();
    const remaining = target - elapsed;
    if (remaining >= 1) await scheduleRestIn(remaining);
    setRunning(true);
  }

  async function pauseTimer() {
    if (!running) return;
    setRunning(false);
    await cancelAllScheduled();
  }

  async function stopTimer() {
    setRunning(false);
    startedAtRef.current = null;
    await cancelAllScheduled();
  }

  async function resetTimer() {
    await pauseTimer();
    setElapsed(0);
    startedAtRef.current = null;
  }

  async function onToggle() {
    if (running) await pauseTimer();
    else await startTimer();
  }

  async function preset(seconds: number) {
    setStopAtText(String(seconds));
    if (running) {
      await cancelAllScheduled();
      const remaining = seconds - elapsed;
      if (remaining >= 1) await scheduleRestIn(remaining);
    }
  }

  return (
    <View
      style={styles.container}
      pointerEvents="box-none"
      accessible
      accessibilityLabel="Rest timer"
    >
      <Text style={styles.time}>
        {mm}:{ss}
      </Text>

      <View style={styles.inputWrap}>
        <Text style={{ color: "#fff" }}>Rest duration (sec)</Text>
        <TextInput
          ref={inputRef}
          value={stopAtText}
          onChangeText={setStopAtText}
          onFocus={() => setInputFocused(true)}
          onBlur={() => {
            setInputFocused(false);
            applyStopAt();
          }}
          keyboardType="number-pad"
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={applyStopAt}
          placeholder="90"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          accessibilityLabel="Rest duration in seconds"
        />
      </View>

      <View style={styles.pillRow}>
        {[60, 90, 120].map((p) => (
          <Pressable
            key={p}
            onPress={() => preset(p)}
            style={styles.pill}
            accessibilityRole="button"
            accessibilityLabel={`${p} seconds preset`}
          >
            <Text style={styles.pillText}>{p}s</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={running ? "Pause timer" : "Start timer"}
        >
          <Text style={{ color: "#fff" }}>{running ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable
          onPress={resetTimer}
          accessibilityRole="button"
          accessibilityLabel="Reset timer"
        >
          <Text style={{ color: "#fff" }}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
