import { RRAppWrapper, RRCamera, RRTextInput } from "components";
import * as React from "react";
import {
  Button,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "constants/colors";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import RRButton from "components/RRButton";
import Close from "assets/svg/Close.svg";
import AddPhoto from "assets/svg/AddPhoto.svg";
import VideoTimer from "assets/svg/VideoTimer.svg";
import VideoInfo1 from "assets/svg/VideoInfo1.svg";
import VideoInfo2 from "assets/svg/VideoInfo2.svg";
import { scaleSize } from "constants/layout";
import { Actionsheet, useDisclose } from "native-base";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "types";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus } from "expo-av";

export default function ViewRequestScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowBtn, setBtnStatus] = useState(true);
  const [isOpenCamera, setCameraStatus] = useState(false);
  const [isShowInfoTxt, setShowInfoTxt] = useState(false);
  const [isOpen, setOpenStatus] = useState(false);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", hideBtn);
    Keyboard.addListener("keyboardDidHide", showBtn);
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", hideBtn);
      Keyboard.removeListener("keyboardDidHide", showBtn);
    };
  }, []);

  const hideBtn = () => {
    setBtnStatus(false);
  };

  const showBtn = () => {
    setBtnStatus(true);
  };

  const onPressProceed = () => {
    navigation.navigate("ShareRequest");
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log(result);
      // setImage(result.uri);
    }
  };

  return (
    <RRAppWrapper>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.requestCntnr}>
            <View style={styles.requestVideoCntnr}>
              <Video
                ref={video}
                style={styles.video}
                source={{
                  uri: "https://review-reels-videos.s3.ap-south-1.amazonaws.com/7685598d-6e72-4157-9136-84e5bc4f3851/Pexels%20Videos%201777362.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5XDWG7WLBYX6Y6GZ%2F20210706%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210706T090451Z&X-Amz-Expires=604800&X-Amz-Signature=9ebf518af46201adf9dad2136a99e0a6c898b4af0cfdae34249bc1fd685adc8a&X-Amz-SignedHeaders=host",
                }}
                resizeMode="contain"
                useNativeControls
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              {/* <View style={styles.buttons}>
                <Button
                  title={status.isPlaying ? "Pause" : "Play"}
                  onPress={() =>
                    status.isPlaying
                      ? video.current.pauseAsync()
                      : video.current.playAsync()
                  }
                />
              </View> */}
            </View>
            <View style={styles.requestMsgCntnr}>
              <Text>Hi</Text>
            </View>
          </View>
        </ScrollView>

        <Actionsheet isOpen={isOpen} onClose={() => setOpenStatus(false)}>
          <Actionsheet.Content>
            <Actionsheet.Item onPressIn={() => pickVideo()}>
              Choose from Gallery
            </Actionsheet.Item>
            <Actionsheet.Item
              onPressIn={() => {
                setShowInfoTxt(true);
                setOpenStatus(false);
              }}
            >
              Capture Video
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
        {isOpenCamera && (
          <RRCamera
            isOpen={isOpenCamera}
            onClose={() => setCameraStatus(false)}
            onCapture={() => setCameraStatus(false)}
          ></RRCamera>
        )}
        {isShowInfoTxt && (
          <View style={styles.videoInfoCntnr}>
            <View style={styles.videoInfoTxtCntnr}>
              <Pressable
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  setShowInfoTxt(false);
                }}
              >
                {Platform.OS == "web" ? (
                  <img style={{ width: 48, height: 48 }} src={Close}></img>
                ) : (
                  <Close width={32} height={32}></Close>
                )}
              </Pressable>
              <View style={styles.videoInfoRow}>
                {Platform.OS == "web" ? (
                  <img style={{ width: 48, height: 48 }} src={VideoTimer}></img>
                ) : (
                  <VideoTimer width={48} height={48}></VideoTimer>
                )}
                <Text style={styles.videoInfoText}>
                  You can reply with a short video of duration less than 30
                  seconds
                </Text>
              </View>
              <View style={styles.videoInfoRow}>
                <View>
                  {Platform.OS == "web" ? (
                    <img
                      style={{ width: 48, height: 48 }}
                      src={VideoInfo1}
                    ></img>
                  ) : (
                    <VideoInfo1 width={48} height={48}></VideoInfo1>
                  )}
                </View>
                <View>
                  <Text style={styles.videoInfoText}>
                    Please try to keep it on point, so that your customers get
                    it easily.
                  </Text>
                </View>
              </View>
              <View style={styles.videoInfoRow}>
                <View>
                  {Platform.OS == "web" ? (
                    <img
                      style={{ width: 48, height: 48 }}
                      src={VideoInfo2}
                    ></img>
                  ) : (
                    <VideoInfo2 width={48} height={48}></VideoInfo2>
                  )}
                </View>
                <View>
                  <Text style={styles.videoInfoText}>
                    You can upload a video from phone or you can make one in
                    next step
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.videoInfoAction}
                onPress={() => {
                  setCameraStatus(true);
                  setShowInfoTxt(false);
                }}
              >
                <Text style={styles.videoInfoActionTxt}>Okay, Got it!</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 40,
    backgroundColor: colors.Athens_Gray,
  },
  headerCntnr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "karla",
    flexWrap: "wrap",
    width: scaleSize(200),
  },
  infoContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.Peach_Cream,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "karla",
  },
  mainContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.White,
    borderRadius: 16,
  },
  addVideoCntnr: {
    backgroundColor: colors.Dove_Grey,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  addVideoTxt: {
    fontFamily: "karla",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  msgCntnr: {
    marginTop: 24,
  },
  videoInfoCntnr: {
    left: 0,
    right: 0,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: colors.Black2,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  videoInfoTxtCntnr: {
    backgroundColor: colors.Peach_Cream,
    padding: 24,
    borderRadius: 16,
  },
  videoInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 48,
  },
  videoInfoText: {
    width: scaleSize(167),
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "karla",
    lineHeight: 20,
    marginLeft: 36,
  },
  videoInfoAction: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.Black4,
    borderRadius: 24,
    marginRight: 8,
    alignSelf: "center",
    marginTop: 48,
  },
  videoInfoActionTxt: {
    color: colors.Black,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "karla",
  },
  requestCntnr: {
    padding: 24,
    backgroundColor: colors.White,
    borderRadius: 16,
  },
  requestVideoCntnr: {
    flex: 1,
  },
  video: {
    borderRadius: 16,
    height: 400,
    width: 300,
  },
});
