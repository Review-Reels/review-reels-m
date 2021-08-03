import { RRAppWrapper, RRCamera, RRTextInput } from "components";
import * as React from "react";
import {
  Keyboard,
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
import AddPhoto from "assets/svg/AddPhoto.svg";
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

export default function ReviewRequestScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowBtn, setBtnStatus] = useState(true);
  const [isOpenCamera, setCameraStatus] = useState(false);
  const [isShowInfoTxt, setShowInfoTxt] = useState(false);
  const [isOpen, setOpenStatus] = useState(false);
  const [video, setVideo] = useState(null);

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

  useEffect(() => {
    console.log(route.params);
    if (route.params) {
      setRequestMessage(route.params.askMessage);
      setVideo({ uri: S3_URL + route.params.videoUrl });
    }
  }, [route]);

  const hideBtn = () => {
    setBtnStatus(false);
  };

  const showBtn = () => {
    setBtnStatus(true);
  };

  const onPressProceed = () => {
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
      setVideo(result);
    }
  };

  const createReviewRequest = (videoPayload) => {
    let formData = new FormData();
    const name = new Date().toISOString() + ".mp4";
    formData.append("fileName", {
      name: name,
      uri: videoPayload.uri,
      type: "video",
    });
    formData.append("askMessage", requestMessage);
    reviewRequest(formData)
      .then((res) => {
        console.log("res", res.data);
        navigation.navigate("ShareRequest");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const updateReviewRequest = (videoPayload) => {
    let formData = new FormData();
    const name = new Date().toISOString() + ".mp4";
    formData.append("fileName", {
      name: name,
      uri: videoPayload.uri,
      type: "video",
    });
    formData.append("askMessage", requestMessage);
    updateReviewRequestApi(formData, route?.params?.id)
      .then((res) => {
        navigation.navigate("ShareRequest");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <RRAppWrapper>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
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
                      width: scaleSize(279),
                      aspectRatio: 9 / 16,
                      borderRadius: 16,
                    },
                  ]}
                  rate={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  volume={0.5}
                  isLooping
                  shouldPlay
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  {Platform.OS == "web" ? (
                    <img style={{ width: 32, height: 32 }} src={AddPhoto}></img>
                  ) : (
                    <AddPhoto width={32} height={32}></AddPhoto>
                  )}
                  <Text style={styles.addVideoTxt}>Add a Video or Image</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.msgCntnr}>
              <RRTextInput
                numberOfLines={4}
                multiline={true}
                label="Message"
                value={requestMessage}
                onChangeText={(value: string) => setRequestMessage(value)}
              ></RRTextInput>
            </View>
          </View>
        </ScrollView>
        {isShowBtn == true ? (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignSelf: "center",
              marginBottom: 16,
            }}
          >
            <RRButton title="Proceed" onPress={onPressProceed}></RRButton>
          </View>
        ) : null}
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
              console.log(video);
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
    marginTop: 40,
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
});
