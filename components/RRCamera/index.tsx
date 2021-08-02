import colors from "constants/Colors";
import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CameraProps } from "types";
import Record from "./record";
import { Audio } from "expo-av";

export default function RRCamera({ isOpen, onCapture, onClose }: CameraProps) {
  const [hasPermission, setPermission] = useState(false);
  const [hasAudioPermission, setAudioPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await Camera.requestPermissionsAsync();
        await Audio.requestPermissionsAsync();
        setPermission(status === "granted");
      } else {
        setPermission(true);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Record onClose={onClose} onCapture={onCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    height: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.Black,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
