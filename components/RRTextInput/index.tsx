import colors from "constants/Colors";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  StyleProp,
  Platform,
} from "react-native";
import { fontFamily } from "styled-system";
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
  ref,
  password,
}: TextInputProps) {
  return (
    <View style={[style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
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
        numberOfLines={Platform.OS == "web" ? numberOfLines : undefined}
        multiline={multiline}
        placeholderTextColor={colors.Black3}
        secureTextEntry={password == true ? true : false}
      />
      {error ? <Text style={styles.errorTxt}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: colors.Concrete,
    color: colors.Black,
    lineHeight: 24,
    minHeight: 56,
    fontFamily: "Karla-Bold",
    marginTop: 8,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorTxt: {
    color: "red",
    fontSize: 12,
    marginTop: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Karla-Bold",
    color: colors.Black2,
  },
  view_only: {
    backgroundColor: "#F5F5F5",
  },
});
