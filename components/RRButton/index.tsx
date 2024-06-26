import colors from "constants/Colors";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "types";

export default function RRButton({
  title = "",
  onPress,
  style,
  isDisabled,
  mode,
  icon = "",
}: ButtonProps) {
  const onPressOk = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        mode == "secondary" && {
          opacity: 90,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
        mode == "cancel" && {
          backgroundColor: colors.Charade,
        },
      ]}
      onPress={onPressOk}
    >
      <Text style={[styles.buttonTitle]}>{title}</Text>
    </TouchableOpacity>
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: colors.Alizarin_Crimson,
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.White,
    lineHeight: 24,
    fontFamily: "Karla-Bold",
  },
});
