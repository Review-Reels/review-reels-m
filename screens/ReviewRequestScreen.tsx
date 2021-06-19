import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper } from "components";
import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "types";
import Close from "assets/svg/Close.svg";
import { Circle, Path, Rect, Svg } from "react-native-svg";

export default function ReviewRequestScreen() {
  return (
    <RRAppWrapper>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Create Your Ask Message</Text>
          {/* <Close width={120} height={40}></Close> */}
        </View>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "karla",
  },
});
