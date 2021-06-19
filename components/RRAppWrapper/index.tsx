import React from "react";
import { StyleSheet, SafeAreaView, StyleProp } from "react-native";
import Colors from "constants/colors";

export default function CSAppWrapper({
  style,
  children,
}: {
  style: StyleProp<any>;
  children: undefined;
}) {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Athens_Gray,
  },
});
