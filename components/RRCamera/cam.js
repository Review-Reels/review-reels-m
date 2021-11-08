import React, { PureComponent } from "react";
import { StyleSheet, View, Pressable, Platform, Text } from "react-native";
import { Camera } from "expo-camera";
import { deviceWidth, scaleSize } from "constants/Layout";
import RecordButton from "assets/svg/RecordButton.svg";
import StopButton from "assets/svg/StopButton.svg";
import FlipCamera from "assets/svg/FlipCamera.svg";
import More from "assets/svg/More.svg";
import colors from "constants/Colors";
import CameraClose from "assets/svg/CameraClose.svg";
import CustomerCountDown from "./countDown";

export default class Cam extends PureComponent {
  render() {
    const {
      handleCameraRef,
      cameraFlipDirection,
      onPressRecord,
      onPressFlip,
      progressText,
      isRecording,
      onPressStop,
      onPressClose,
    } = this.props;
    return (
      <View style={[styles.cameraContainer, { width: scaleSize(375) }]}>
        {isRecording && <CustomerCountDown></CustomerCountDown>}
        {!isRecording && (
          <Pressable
            onPress={onPressClose}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              zIndex: 999,
            }}
          >
            {Platform.OS == "web" ? (
              <img style={{ width: 48, height: 48 }} src={CameraClose}></img>
            ) : (
              <CameraClose width={48} height={48}></CameraClose>
            )}
          </Pressable>
        )}
        <Camera
          style={styles.camera}
          type={cameraFlipDirection}
          ref={handleCameraRef}
          ratio="16:9"
          autoFocus={Camera.Constants.AutoFocus.on}
          codec={Camera.Constants.VideoCodec["H264"]}
        />
        <View style={styles.actionButtons}>
          <View style={{ width: 48 }}></View>
          {isRecording ? (
            <Pressable onPress={onPressStop}>
              {Platform.OS == "web" ? (
                <img src={StopButton}></img>
              ) : (
                <StopButton
                  style={styles.button}
                  height={56}
                  width={56}
                ></StopButton>
              )}
            </Pressable>
          ) : (
            <Pressable onPress={onPressRecord}>
              {Platform.OS == "web" ? (
                <img src={RecordButton}></img>
              ) : (
                <RecordButton
                  style={styles.button}
                  height={56}
                  width={56}
                ></RecordButton>
              )}
            </Pressable>
          )}
          <View style={{ width: 24 }}>
            {!isRecording && (
              <Pressable onPress={onPressFlip}>
                {Platform.OS == "web" ? (
                  <img src={FlipCamera}></img>
                ) : (
                  <FlipCamera
                    style={styles.button}
                    height={24}
                    width={24}
                  ></FlipCamera>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    // height: 600,
    borderRadius: 16,
    aspectRatio: 9 / 16,
    padding: 8,
  },
  videoTimer: {
    color: colors.White,
    backgroundColor: colors.Black2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "center",
    position: "absolute",
    zIndex: 5,
    top: 24,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Karla-Bold",
    lineHeight: 24,
  },
  actionButtons: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 32,
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 24,
  },
});
