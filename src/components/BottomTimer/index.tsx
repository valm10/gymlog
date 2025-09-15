import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";

export default function BottomTimer() {
  const [sec, setSec] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (on) ref.current = setInterval(() => setSec((s) => s + 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [on]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        borderTopWidth: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {mm}:{ss}
      </Text>
      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <Pressable onPress={() => setOn((v) => !v)}>
          <Text>{on ? "Pause" : "Start"}</Text>
        </Pressable>
        <Pressable onPress={() => setSec(0)}>
          <Text>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}
