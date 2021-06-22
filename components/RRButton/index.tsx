import colors from "constants/colors";
import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { ButtonType } from "types";

export default function RRButton({
  title = "",
  onPress,
  style,
  isDisabled,
}: ButtonType) {
  const onPressOk = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <Pressable style={[styles.container]} onPress={onPressOk}>
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
