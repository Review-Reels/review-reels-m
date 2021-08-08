import { RRAppWrapper, RRCamera, RRTextInput } from "components";
import * as React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "constants/Colors";
import { useEffect, useState } from "react";
import RRButton from "components/RRButton";
import Close from "assets/svg/Close.svg";
import VideoCap from "assets/svg/VideoCap.svg";
import VideoCam from "assets/svg/VideoCam.svg";
import { scaleSize } from "constants/Layout";
import { Actionsheet, useDisclose } from "native-base";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "types";
import * as ImagePicker from "expo-image-picker";
import MerchantVideoInfo from "screens/shared/merchant-video-info";
import { Video } from "expo-av";
import { S3_URL } from "constants/apiUrls";
import {
  reviewRequest,
  updateReviewRequestApi,
} from "services/api/review-request";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER } from "context/authActions";
import { DataURIToBlob } from "utils/convertToBlob";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import mime from "mime";
import { LinearGradient } from "expo-linear-gradient";

export default function ReviewRequestScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isOpenCamera, setCameraStatus] = useState(false);
  const [isShowInfoTxt, setShowInfoTxt] = useState(false);
  const [isOpen, setOpenStatus] = useState(false);
  const [video, setVideo] = useState(null);
  const [isNewVideo, setIsNewVideo] = useState(false);
  const { authState, authDispatch } = React.useContext(authContext);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    return () => {};
  }, []);

  useEffect(() => {
    if (route.params) {
      setRequestMessage(route.params.askMessage);
      setVideo({ uri: S3_URL + route.params.videoUrl });
    }
  }, [route]);

  const onPressProceed = () => {
    console.log(route?.params?.id, video);
    if (route?.params?.id) updateReviewRequest(video);
    else createReviewRequest(video);
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setOpenStatus(false);
      setVideo(result);
      setIsNewVideo(true);
    }
  };

  const createReviewRequest = (videoPayload) => {
    if (!videoPayload?.uri) return;
    let formData = new FormData();
    const name = new Date().toISOString() + ".mp4";
    if (Platform.OS == "web") {
      const file = DataURIToBlob(videoPayload.uri);
      formData.append("fileName", file);
    } else {
      formData.append("fileName", {
        name: name,
        uri: videoPayload.uri,
        type: mime.getType(videoPayload.uri),
      });
    }
    formData.append("askMessage", requestMessage);
    authDispatch(set(SET_LOADER, true));
    reviewRequest(formData)
      .then((res) => {
        authDispatch(set(SET_LOADER, false));
        navigation.navigate("ShareRequest");
      })
      .catch((err) => {
        console.log(err);
        authDispatch(set(SET_LOADER, false));
      });
  };

  const updateReviewRequest = (videoPayload) => {
    if (!videoPayload?.uri) return;
    let formData = new FormData();
    if (isNewVideo) {
      const name = new Date().toISOString() + ".mp4";
      if (Platform.OS == "web") {
        const file = DataURIToBlob(videoPayload.uri);
        formData.append("fileName", file);
      } else {
        formData.append("fileName", {
          name: name,
          uri: videoPayload.uri,
          type: mime.getType(videoPayload.uri),
        });
      }
    }
    formData.append("askMessage", requestMessage);
    authDispatch(set(SET_LOADER, true));
    updateReviewRequestApi(formData, route?.params?.id)
      .then((res) => {
        authDispatch(set(SET_LOADER, false));
        navigation.navigate("ShareRequest");
      })
      .catch((err) => {
        authDispatch(set(SET_LOADER, false));
      });
  };

  return (
    <RRAppWrapper>
      <View
        style={{
          flex: 1,
          paddingBottom: 24,
          backgroundColor: colors.Athens_Gray,
        }}
      >
        {/* <ScrollView style={styles.container}> */}
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
        >
          <View style={styles.headerCntnr}>
            <Text style={styles.title}>Create Your Ask Message</Text>
            <Pressable onPress={() => navigation.goBack()}>
              {Platform.OS == "web" ? (
                <img style={{ width: 48, height: 48 }} src={Close}></img>
              ) : (
                <Close width={48} height={48}></Close>
              )}
            </Pressable>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              The card below will be shown to your customers as a message from
              you. Let’s make it sound irresistable!
            </Text>
          </View>
          <View style={styles.mainContainer}>
            <Pressable
              style={styles.addVideoCntnr}
              onPress={() => {
                setShowInfoTxt(true);
              }}
            >
              {video ? (
                <Video
                  source={{ uri: video.uri }}
                  style={[
                    styles.image,
                    {
                      width: scaleSize(295),
                      borderRadius: 16,
                      aspectRatio: 9 / 16,
                    },
                  ]}
                  rate={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  volume={0.5}
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  {Platform.OS == "web" ? (
                    <img style={{ width: 32, height: 32 }} src={VideoCap}></img>
                  ) : (
                    <VideoCap width={32} height={32}></VideoCap>
                  )}
                  <Text style={styles.addVideoTxt}>Add a Short Video</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.msgCntnr}>
              <RRTextInput
                numberOfLines={4}
                multiline={true}
                label="MESSAGE"
                value={requestMessage}
                placeholder="Write your message here"
                onChangeText={(value: string) => setRequestMessage(value)}
              ></RRTextInput>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Pressable style={styles.button}>
                {Platform.OS == "web" ? (
                  <img src={VideoCam}></img>
                ) : (
                  <VideoCam></VideoCam>
                )}
                <Text style={styles.buttonTxt}>Reply with Video</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <LinearGradient
          style={{
            height: 200,
            position: "absolute",
            bottom: 0,
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        >
          <View style={styles.proceedBtnCntnr}>
            <RRButton
              title="Save Ask Message"
              onPress={onPressProceed}
            ></RRButton>
          </View>
        </LinearGradient>
        <Actionsheet isOpen={isOpen} onClose={() => setOpenStatus(false)}>
          <Actionsheet.Content>
            <Actionsheet.Item onPressIn={() => pickVideo()}>
              Choose from Gallery
            </Actionsheet.Item>
            <Actionsheet.Item
              onPressIn={() => {
                setCameraStatus(true);
                setOpenStatus(false);
                setVideo(null);
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
            onCapture={(video: any) => {
              setVideo(video);
              setCameraStatus(false);
              setIsNewVideo(true);
            }}
          ></RRCamera>
        )}
        {isShowInfoTxt && (
          <MerchantVideoInfo
            onPressOk={() => {
              setShowInfoTxt(false);
              setOpenStatus(true);
            }}
            onPressClose={() => setShowInfoTxt(false)}
          />
        )}
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  image: {
    flex: 1,
    transform: [
      {
        scaleX: -1,
      },
    ],
  },
  headerCntnr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Karla",
    flexWrap: "wrap",
    width: scaleSize(200),
    color: colors.Black5,
  },
  button: {
    flexDirection: "row",
    borderRadius: 64,
    paddingHorizontal: 48,
    paddingVertical: 18,
    backgroundColor: colors.Alizarin_Crimson,
    marginTop: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: colors.Alizarin_Crimson,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    opacity: 0.2,
    alignItems: "center",
  },
  buttonTxt: {
    marginLeft: 14,
    color: colors.White,
    fontFamily: "Karla",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },
  infoContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.Peach_Cream,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Karla",
    lineHeight: 20,
    color: colors.Black5,
  },
  mainContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.White,
    borderRadius: 16,
    marginBottom: 48,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: colors.Black,
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addVideoCntnr: {
    backgroundColor: colors.Dove_Grey,
    minHeight: 344,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  addVideoTxt: {
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: colors.Black5,
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
    fontFamily: "Karla",
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
    fontFamily: "Karla",
  },
  proceedBtnCntnr: {
    alignSelf: "center",
    marginBottom: 24,
  },
});
