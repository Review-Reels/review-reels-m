import { StackScreenProps } from "@react-navigation/stack";
import { RRTextInput } from "components";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { RootStackParamList } from "types";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} />
      <RRTextInput placeholder="Username"></RRTextInput>
      <RRTextInput placeholder="Password"></RRTextInput>
      <Button title="Login" onPress={() => navigation.replace("Home")}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
