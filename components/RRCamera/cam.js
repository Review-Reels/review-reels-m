import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Camera } from "expo-camera";

export default class Cam extends PureComponent {
  render() {
    const { handleCameraRef, cameraFlipDirection } = this.props;
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={cameraFlipDirection}
          ref={handleCameraRef}
          ratio="16:9"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraContainer: {
    height: 400,
  },
});
