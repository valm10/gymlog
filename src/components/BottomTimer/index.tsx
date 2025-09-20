import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./style";

export default function BottomTimer() {
  const [sec, setSec] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null); // RN-safe

  useEffect(() => {
    if (on) ref.current = setInterval(() => setSec((s) => s + 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [on]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {mm}:{ss}
      </Text>
      <View style={styles.row}>
        <Pressable onPress={() => setOn((v) => !v)}>
          <Text style={{ color: "#fff" }}>{on ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setSec(0);
            setOn(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
