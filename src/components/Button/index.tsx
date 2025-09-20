import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";

type Props = {
  text: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export function Button({
  text,
  onPress,
  loading,
  style,
  textStyle,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          height: 48,
          borderRadius: 12,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[{ color: "#fff", fontWeight: "700" }, textStyle]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}
