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
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      video: null,
      videoIsLoading: false,
      progressText: VIDEO_DURATION / 1000,
      showPreview: false,
      cameraType: "back",
    };

    this.isRecording = false;

    this.handleCameraRef = this.handleCameraRef.bind(this);
    this.handleRecordButtonRef = this.handleRecordButtonRef.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onRecordVideo = this.onRecordVideo.bind(this);
    this.handleVideoPlayerRef = this.handleVideoPlayerRef.bind(this);
    this.onPlaybackStatusUpdate = this.onPlaybackStatusUpdate.bind(this);
    this.cancelMedia = this.cancelMedia.bind(this);

    this.updateProgressText = this.updateProgressText.bind(this);
  }
  async onPlaybackStatusUpdate(status) {
    if (status.didJustFinish && !status.isLooping && !status.isPlaying) {
      if (this.video) {
        if (!this.recordingWasManuallyCancelled) {
        }
        await this.video.replayAsync();
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
        // NOTE
        // There appears to be some relationship between maxDuration in recordAsync and this bug.
        const video = await this.camera.recordAsync({
          maxDuration: 30,
          codec: Camera.Constants.VideoCodec["H264"],
          quality: Camera.Constants.VideoQuality["2160p"],
          mirror: false,
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

  onPressTakeAgain = () => {
    this.setState({ video: null, videoIsLoading: false, showPreview: false });
  };

  onPressClose = () => {
    this.props.onClose();
  };

  onPressProceed = () => {
    this.props.onCapture(this.state.video);
  };

  render() {
    const {
      video,
      isRecording,
      videoIsLoading,
      progressText,
      showPreview,
      cameraType,
    } = this.state;
    return (
      <View style={styles.container}>
        {showPreview ? (
          <Preview
            video={video}
            handleVideoRef={this.handleVideoPlayerRef}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onPressTakeAgain={() => this.onPressTakeAgain()}
            onPressProceed={this.onPressProceed}
            onPressClose={this.onPressClose}
          />
        ) : (
          <Cam
            handleCameraRef={this.handleCameraRef}
            cameraFlipDirection={Camera.Constants.Type[cameraType]}
            onPressRecord={this.onPress}
            progressText={progressText}
            isRecording={isRecording}
            onPressStop={this.onStopRecording}
            onPressClose={this.onPressClose}
            onPressFlip={() => {
              cameraType == "back"
                ? this.setState({ cameraType: "front" })
                : this.setState({ cameraType: "back" });
            }}
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
