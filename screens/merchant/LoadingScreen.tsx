import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "types";
import Splash from "_assets/images/splash.png";

export default function LoadingScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  return (
    <View style={styles.container}>
      <Image resizeMode="center" source={Splash} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
