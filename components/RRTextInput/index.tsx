import colors from "constants/Colors";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  StyleProp,
} from "react-native";
import { TextInputProps } from "types";

export default function RRTextInput({
  placeholder,
  value,
  error,
  style,
  label,
  onChangeText,
  onSubmitEditing,
  disabled,
  numberOfLines,
  multiline,
}: TextInputProps) {
  return (
    <View style={[style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={!disabled}
        style={[
          styles.input,
          error ? styles.errorInput : null,
          disabled ? styles.view_only : null,
        ]}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        placeholder={placeholder}
        onSubmitEditing={onSubmitEditing}
        numberOfLines={numberOfLines}
        multiline={multiline}
        placeholderTextColor={colors.Black3}
      />
      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    // height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: colors.Concrete,
    color: colors.Black,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorTxt: {
    color: "red",
    fontSize: 12,
    marginLeft: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "karla",
    marginBottom: 8,
    color: colors.Black2,
  },
  view_only: {
    backgroundColor: "#F5F5F5",
  },
});
