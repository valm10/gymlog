import React from "react";
import { Text } from "react-native";

type Props = { msg?: string | null };
export default function InlineError({ msg }: Props) {
  if (!msg) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      style={{ color: "#B00020", marginTop: 4, fontSize: 12 }}
    >
      {msg}
    </Text>
  );
}
