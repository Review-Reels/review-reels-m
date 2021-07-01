import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  LayoutAnimation,
} from "react-native";
import { Camera } from "expo-camera";
import ProgressBar from "./progressBar";
import { countdown } from "../../utils/countdown";

const VIDEO_DURATION = 7000;

//  my components
import Cam from "./cam";
import CameraOverlay from "./overlay";
import Preview from "./preview";

export default class Record extends React.Component {
  constructor() {
    super();

    this.state = {
      isRecording: false,
      video: null,
      videoIsLoading: false,
      progressText: VIDEO_DURATION / 1000,
    };

    this.progressAnimation = new Animated.Value(0);
    this.progressTranslateX = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["-200%", "0%"],
    });
    this.progressFlex = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    this.progressBackgroundColor = this.progressAnimation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: [
        "#ff470f",
        "#ff3860",
        "#b86bff",
        "#2196f3",
        "#b86bff",
        "#ff7600",
        "#3273dc",
        "red",
        "#FF5F14",
      ],
    });

    this.isRecording = false;
    this.recordingWasManuallyCancelled = false;

    this.handleCameraRef = this.handleCameraRef.bind(this);
    this.handleRecordButtonRef = this.handleRecordButtonRef.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onRecordVideo = this.onRecordVideo.bind(this);
    this.handleVideoPlayerRef = this.handleVideoPlayerRef.bind(this);
    this.onPlaybackStatusUpdate = this.onPlaybackStatusUpdate.bind(this);
    this.cancelMedia = this.cancelMedia.bind(this);

    this.animateProgressBar = this.animateProgressBar.bind(this);
    this.animationStyle = this.animationStyle.bind(this);
    this.updateProgressText = this.updateProgressText.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
  }
  async onPlaybackStatusUpdate(status) {
    // THIS FUNCTION DOESN'T ACTUALLY DO ANYTHING RIGHT NOW.
    // I tried messing around with it to manually loop the video and see if that would fix it, but no luck...

    // console.log('\n\n\n', status, '\n\n\n');
    if (status.didJustFinish && !status.isLooping && !status.isPlaying) {
      if (this.video) {
        console.log("video should loop now...");
        if (!this.recordingWasManuallyCancelled) {
          // For some reason, if you manually trigger this.video.stopRecording(),
          // then looping faces a bug after the first playback, where it just freezes indefinitely.
          // However, if the video gets canceled on its own with the time running out from
          // maxDuration: 4, then there's no issue  with looping after the first playback.
          // Thus, we check if the user cancelled the recording or if it happened on its own.
          // this.video.setIsLoopingAsync(true);
        }
        // await this.video.setIsLoopingAsync(true);
        // console.log('set to loop...');
        await this.video.replayAsync();
        console.log("was replayed...");
      }
    }
  }
  // used to cancel video that was recorded already, or to start/pause a current recording
  onPress() {
    this.onRecordVideo();
  }
  async onRecordVideo() {
    if (this.camera) {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ isRecording: true }, async () => {
        this.isRecording = true; // variable used for other functions that need to know if it's recording without waiting for state
        // this.recordTime = ;
        console.log("RECORDING STARTED");

        this.animateProgressBar();
        this.startCountdown();
        // NOTE
        // There appears to be some relationship between maxDuration in recordAsync and this bug.
        const video = await this.camera.recordAsync({
          maxDuration: VIDEO_DURATION / 1000,
        });
        this.isRecording = false;

        console.log(video);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ videoIsLoading: false, isRecording: false, video });
        // this.setState({ isRecording: false, video });
      });
    }
  }
  cancelMedia() {
    this.setState({ video: null });
  }
  handleCameraRef(ref) {
    this.camera = ref;
  }
  handleVideoPlayerRef(ref) {
    this.video = ref;
    if (this.video) {
      // Comment the line below in/out to see the bug
      // this.video.setIsLoopingAsync(true);
    }
  }
  handleRecordButtonRef(ref) {
    this.recordButton = ref;
  }
  updateProgressText(progressText) {
    this.setState({ progressText });
  }
  startCountdown() {
    const endDate = Date.now() + VIDEO_DURATION;
    this.setState({ progressText: VIDEO_DURATION / 1000 }, () =>
      countdown(endDate, this.updateProgressText)
    );
  }
  animateProgressBar() {
    this.progressAnimation.setValue(0);
    Animated.timing(this.progressAnimation, {
      toValue: 1,
      useNativeDriver: false,
      easing: Easing.linear,
      duration: VIDEO_DURATION,
    }).start();
  }
  animationStyle() {
    const { progressFlex: flex, progressBackgroundColor: backgroundColor } =
      this;
    return {
      flex,
      // transform: [
      //   { translateX }
      // ],
      backgroundColor,
    };
  }
  render() {
    const { video, isRecording, videoIsLoading, progressText } = this.state;
    return (
      <View style={styles.container}>
        <Cam
          handleCameraRef={this.handleCameraRef}
          cameraFlipDirection={Camera.Constants.Type.front}
        />
        <ProgressBar
          video={video}
          isRecording={isRecording}
          animationStyle={this.animationStyle()}
          progressText={progressText}
          cancelMedia={this.cancelMedia}
          videoIsLoading={videoIsLoading}
        />
        <CameraOverlay
          onPress={this.onPress}
          onPressOut={this.onPressOut}
          onLongPress={this.onLongPress}
          video={video}
          isRecording={isRecording}
        />
        <Preview
          video={video}
          handleVideoRef={this.handleVideoPlayerRef}
          onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
        />
      </View>
    );
  }
}

const whatTimeIsIt = () => {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const seconds = date.getSeconds();
  const mill = date.getMilliseconds();
  const time = `${hour}:${min}:${seconds}.${mill}`;
  return time;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
