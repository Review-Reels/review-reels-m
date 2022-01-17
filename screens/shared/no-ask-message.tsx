import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import RRButton from "components/RRButton";
import { Video } from "expo-av";
import { scaleSize } from "constants/Layout";
import colors from "constants/Colors";

export default function NoAskMessage({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.askVideoCntnr}>
        <Video
          source={{
            uri: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-small.mp4",
          }}
          style={{
            borderRadius: 16,
            width: scaleSize(295),
            aspectRatio: 2 / 3,
          }}
          rate={1.0}
          isMuted={false}
          resizeMode="contain"
          volume={0.5}
          isLooping
          shouldPlay
          useNativeControls={false}
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
        <View style={{ alignSelf: "center" }}>
          <RRButton
            title="Create Ask Message"
            onPress={() => navigation.push("ReviewRequest")}
          ></RRButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  askVideoCntnr: {
    flex: 2,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  askCntnr: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  askTxt1: {
    fontFamily: "Karla",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
    color: colors.Black5,
  },
  askTxt2: {
    fontFamily: "Karla-Bold",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
    color: colors.Black5,
  },
});
