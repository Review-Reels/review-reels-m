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
  Image,
} from "react-native";
import colors from "constants/Colors";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import RRButton from "components/RRButton";

import { scaleSize } from "constants/Layout";
import { Actionsheet, useDisclose } from "native-base";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "types";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import CustomerVideoInfo from "screens/shared/customer-video-info";
import CustomerInfo from "screens/shared/customer-info";
import { getReviewRequestWithUsername } from "services/api/review-request";
import {
  submitReview,
  updateReviewResponse,
} from "services/api/review-response";
import PlayButton from "assets/svg/PlayButton.svg";

import { S3_URL } from "constants/apiUrls";
import { DataURIToBlob } from "utils/convertToBlob";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER } from "context/authActions";
export default function ViewRequestScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowInfoTxt, setShowInfoTxt] = useState(false);
  const [isShowCustomerInfo, setShowCustomerInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [reviewRequest, setReviewRequest] = React.useState({
    videoUrl: "",
    askMessage: "",
    id: "",
  });
  const [showVideo, setShowVideo] = React.useState(false);
  const { authState, authDispatch } = React.useContext(authContext);
  const video = React.useRef(null);

  useEffect(() => {
    getReviewRequestWithUsername(route.params.username).then((res) => {
      if (res.data.length) setReviewRequest(res.data[0]);
    });
  }, [route]);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.cancelled) {
      setSelectedFile(result);
      setShowCustomerInfo(true);
    }
  };

  const onPressReply = () => {
    setShowInfoTxt(true);
    setShowVideo(false);
    video.current.stopAsync();
  };

  const onProceedCustomerInfo = (info: any) => {
    setShowCustomerInfo(false);
    let formData = new FormData();
    const name = new Date().toISOString() + ".mp4";
    const file = DataURIToBlob(selectedFile.uri);
    formData.append("fileName", file);
    formData.append("customerName", info.name);
    formData.append("whatYouDo", info.job);
    formData.append("reviewRequestId", reviewRequest.id);
    formData.append("platform", Platform.OS);
    authDispatch(set(SET_LOADER, true));
    if (route.params.reviewResponseId) {
      updateReviewResponse(formData, route.params.reviewResponseId)
        .then((res) => {
          authDispatch(set(SET_LOADER, false));
          navigation.navigate("SubmitSuccess", { user: reviewRequest.user });
        })
        .catch((err) => {
          authDispatch(set(SET_LOADER, false));
          console.log("err", err);
        });
    } else {
      submitReview(formData)
        .then((res) => {
          authDispatch(set(SET_LOADER, false));
          navigation.navigate("SubmitSuccess", { user: reviewRequest.user });
        })
        .catch((err) => {
          authDispatch(set(SET_LOADER, false));
          console.log("err", err);
        });
    }
  };

  return (
    <RRAppWrapper style={{ backgroundColor: colors.Athens_Gray }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.addVideoCntnr}>
            {reviewRequest.videoUrl && (
              <Video
                ref={video}
                source={{ uri: S3_URL + reviewRequest.videoUrl }}
                // style={[
                //   {
                //     width: scaleSize(279),
                //     aspectRatio: 9 / 16,
                //     borderRadius: 16,
                //     alignSelf: "center",
                //   },
                // ]}
                // useNativeControls={true}
                style={styles.rounded}
                rate={1.0}
                isMuted={false}
                resizeMode="contain"
                volume={0.5}
                useNativeControls
              />
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.requestMsgCntnr}>
              <Text style={styles.requestMsgTxt}>
                {reviewRequest?.askMessage}
              </Text>
            </View>
            <RRButton
              style={styles.mt_24}
              onPress={onPressReply}
              title="Reply with Video"
            ></RRButton>
          </View>
        </ScrollView>
        {isShowInfoTxt && (
          <CustomerVideoInfo
            onPressClose={() => {
              setShowInfoTxt(false);
            }}
            onPressOk={() => {
              setShowInfoTxt(false);
              pickVideo();
            }}
          ></CustomerVideoInfo>
        )}
        {isShowCustomerInfo && (
          <CustomerInfo
            visible={isShowCustomerInfo}
            onPressProceed={(info: any) => onProceedCustomerInfo(info)}
            onPressClose={() => setShowCustomerInfo(false)}
          ></CustomerInfo>
        )}
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    // backgroundColor: colors.White,
    paddingHorizontal: 24,
  },
  mt_24: {
    marginTop: 24,
  },
  headerCntnr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Karla-Bold",
    flexWrap: "wrap",
    width: scaleSize(200),
  },
  addVideoCntnr: {
    backgroundColor: colors.White,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  addVideoTxt: {
    fontFamily: "Karla-Bold",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  msgCntnr: {
    marginTop: 24,
  },
  requestCntnr: {
    padding: 24,
    backgroundColor: colors.White,
    borderRadius: 16,
  },
  requestVideoCntnr: {
    flex: 1,
  },
  requestMsgCntnr: {
    marginTop: 24,
  },
  requestMsgTxt: {
    fontFamily: "Karla",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  video: {
    borderRadius: 16,
  },
  fileInput: {
    display: "none",
  },
  rounded: {
    height: "100%",
    width: scaleSize(279),
    aspectRatio: 9 / 16,
    borderRadius: 16,
    alignSelf: "center",
  },
  overlay: {
    width: "100%",
    marginBottom: 8,
  },
});
