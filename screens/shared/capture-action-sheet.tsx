import { StackScreenProps } from "@react-navigation/stack";
import { Actionsheet } from "native-base";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "types";

export default function CaptureActionSheet({
  onClose,
  onPressGallery,
  onPressCamera,
}: {
  onClose: any;
  onPressGallery: any;
  onPressCamera: any;
}) {
  return (
    <Actionsheet isOpen={true} onClose={onClose}>
      <Actionsheet.Content>
        <Actionsheet.Item onPressIn={onPressGallery}>
          Choose from Gallery
        </Actionsheet.Item>
        <Actionsheet.Item onPressIn={onPressCamera}>
          Capture Video
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
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
