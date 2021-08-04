import * as React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Chat from "assets/svg/Chat.svg";
import RRButton from "components/RRButton";
import { Video } from "expo-av";
import { scaleSize } from "constants/Layout";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "types";

export default function NoAskMessage({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.askVideoCntnr}>
        <Video
          source={{
            uri: " https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-pool-1259-large.mp4",
          }}
          style={{
            borderRadius: 16,
            width: scaleSize(310),
            aspectRatio: 9 / 16,
            alignSelf: "center",
          }}
          rate={1.0}
          isMuted={false}
          resizeMode="contain"
          volume={0.5}
          isLooping
          shouldPlay
          useNativeControls
        />
      </View>
      <View style={styles.askCntnr}>
        <Text style={styles.askTxt1}>
          Its easy, create your ask message, share it with your customers using
          our unique link, get video replies in your inbox.
        </Text>
        <Text style={styles.askTxt2}>
          Let’s get started right away by creating your ask message.
        </Text>
        <RRButton
          title="Create Ask Message"
          onPress={() => navigation.push("ReviewRequest")}
        ></RRButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  askVideoCntnr: {
    flex: 3,
    padding: 16,
    borderRadius: 16,
  },
  askCntnr: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  askTxt1: {
    fontFamily: "karla",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
  },
  askTxt2: {
    fontFamily: "karla",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
  },
});
