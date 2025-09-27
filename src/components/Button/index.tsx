import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import theme from "../../global/themes";

type Props = {
  text: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
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
  const bg = theme.colors.primary;
  const base: ViewStyle = {
    height: 48,
    borderRadius: 12,
    backgroundColor: bg,
    alignItems: "center",
    justifyContent: "center",
  };
  const disabledStyle: ViewStyle = disabled || loading ? { opacity: 0.6 } : {};
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[base, disabledStyle, style]}
      accessibilityRole="button"
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
