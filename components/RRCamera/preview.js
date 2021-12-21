import React, { PureComponent } from "react";
import { View, StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import RRButton from "components/RRButton";
import CameraClose from "assets/svg/CameraClose.svg";
import { bottom } from "styled-system";

export default class Preview extends PureComponent {
  render() {
    const {
      video,
      onReadyForDisplay,
      onLoad,
      onLoadStart,
      handleVideoRef,
      onPlaybackStatusUpdate,
      onPressTakeAgain,
      onPressProceed,
      onPressClose,
    } = this.props;
    if (1) {
      const { height, width } = Dimensions.get("window");
      return (
        <View style={[styles.container, { height, width }]}>
          <Pressable
            onPress={onPressClose}
            style={{
              position: "absolute",
              top: 48,
              right: 24,
              zIndex: 999,
            }}
          >
            {Platform.OS == "web" ? (
              <img style={{ width: 48, height: 48 }} src={Close}></img>
            ) : (
              <CameraClose width={48} height={48}></CameraClose>
            )}
          </Pressable>
          <Video
            source={{ uri: video.uri }}
            style={[styles.image, { height, width }]}
            rate={1.0}
            isMuted={false}
            resizeMode="cover"
            volume={0.5}
            isLooping
            ref={handleVideoRef}
            shouldPlay
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 24,
              position: "absolute",
              bottom: 24,
              left: 0,
              right: 0,
            }}
          >
            <View>
              <RRButton
                onPress={onPressTakeAgain}
                title="Take Again"
                mode="secondary"
              ></RRButton>
            </View>
            <View>
              <RRButton onPress={onPressProceed} title="Proceed"></RRButton>
            </View>
          </View>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  image: {
    flex: 1,
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
});
