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

const VIDEO_DURATION = 30000;

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
      showPreview: false,
    };

    this.isRecording = false;
    this.recordingWasManuallyCancelled = false;

    this.handleCameraRef = this.handleCameraRef.bind(this);
    this.handleRecordButtonRef = this.handleRecordButtonRef.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onRecordVideo = this.onRecordVideo.bind(this);
    this.handleVideoPlayerRef = this.handleVideoPlayerRef.bind(this);
    this.onPlaybackStatusUpdate = this.onPlaybackStatusUpdate.bind(this);
    this.cancelMedia = this.cancelMedia.bind(this);

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
    if (!this.isRecording) this.onRecordVideo();
    else this.onStopRecording();
  }

  onStopRecording = () => {
    this.camera.stopRecording();
    this.setState({ isRecording: false, progressText: VIDEO_DURATION / 1000 });
  };

  async onRecordVideo() {
    if (this.camera) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ isRecording: true }, async () => {
        this.isRecording = true; // variable used for other functions that need to know if it's recording without waiting for state
        this.startCountdown();
        // NOTE
        // There appears to be some relationship between maxDuration in recordAsync and this bug.
        const video = await this.camera.recordAsync({
          maxDuration: VIDEO_DURATION / 1000,
        });
        this.isRecording = false;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
          videoIsLoading: false,
          isRecording: false,
          video,
          showPreview: true,
        });
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

  onPressTakeAgain = () => {
    this.setState({ video: null, videoIsLoading: false });
  };

  render() {
    const { video, isRecording, videoIsLoading, progressText } = this.state;
    return (
      <View style={styles.container}>
        {showPreview ? (
          <Preview
            video={video}
            handleVideoRef={this.handleVideoPlayerRef}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onPressTakeAgain={() => this.onPressTakeAgain()}
            onPressProceed={this.onPressProceed}
          />
        ) : (
          <Cam
            handleCameraRef={this.handleCameraRef}
            cameraFlipDirection={Camera.Constants.Type.front}
            onPressRecord={this.onPress}
            progressText={progressText}
            isRecording={isRecording}
            onPressStop={this.onStopRecording}
          />
        )}
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
    alignItems: "center",
    justifyContent: "center",
  },
});
