import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  StyleProp,
} from "react-native";
import { TextInputType } from "types";

export default function RRTextInput({
  placeholder,
  value,
  error,
  style,
  label,
  onChangeText,
  onSubmitEditing,
  inputType,
  disabled,
}: TextInputType) {
  return (
    <View style={[style, styles.container]}>
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
      />
      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 24,
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "400",
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
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.11,
    marginBottom: 8,
  },
  view_only: {
    backgroundColor: "#F5F5F5",
  },
});
