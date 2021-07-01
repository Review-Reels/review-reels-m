export async function onPlaybackStatusUpdate(status) {
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
      console.log("set to loop...");
      // await this.video.replayAsync();
      console.log("was replayed...");
    }
  }
}
export function onPress() {
  const { video, isRecording } = this.state;
  if (video && video.uri) {
    if (this.camera) {
      // this.camera.stopRecording();
      this.setState({ video: null });
      this.recordingWasManuallyCancelled = false;
    }
  }
}
export function onLongPress() {
  this.onRecordVideo();
}
export function onPressOut() {
  if (this.isRecording) {
    this.recordingWasManuallyCancelled = true;
    this.onStopRecording();
  }
}
export function onStopRecording() {
  if (this.isRecording) {
    this.setState({ videoIsLoading: true }, () => {
      this.camera.stopRecording();
    });
  }
}
export function onRecordVideo() {
  if (this.camera) {
    this.setState({ isRecording: true }, async () => {
      this.isRecording = true; // variable used for other functions that need to know if it's recording without waiting for state

      // NOTE
      // There appears to be some relationship between maxDuration in recordAsync and this bug.
      const video = await this.camera.recordAsync();
      this.isRecording = false;

      console.log(video);
      this.setState({ isRecording: false, video, videoIsLoading: false });
    });
  }
}
export function handleCameraRef(ref) {
  this.camera = ref;
}
export function handleVideoPlayerRef(ref) {
  this.video = ref;
  if (this.video) {
    // Comment the line below in/out to see the bug
    // this.video.setIsLoopingAsync(true);
  }
}
