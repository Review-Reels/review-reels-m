import colors from "constants/colors";
import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ButtonProps } from "types";

export default function RRButton({
  title = "",
  onPress,
  style,
  isDisabled,
  mode,
}: ButtonProps) {
  const onPressOk = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        style,
        mode == "secondary" && {
          opacity: 90,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
      ]}
      onPress={onPressOk}
    >
      <Text style={[styles.buttonTitle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.Alizarin_Crimson,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 64,
    width: "100%",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.White,
    lineHeight: 24,
  },
});
