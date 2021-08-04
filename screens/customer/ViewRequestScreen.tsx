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
import { submitReview } from "services/api/review-request";

import { S3_URL } from "constants/apiUrls";
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

  useEffect(() => {
    getReviewRequestWithUsername(route.params.username).then((res) => {
      console.log(res);
      if (res.data.length) setReviewRequest(res.data[0]);
    });
  }, [route]);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [16, 9],
      quality: 1,
      base64: false,
    });
    setSelectedFile(result);
    setShowCustomerInfo(true);
  };

  const onPressReply = () => {
    setShowInfoTxt(true);
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
    submitReview(formData)
      .then((res) => {
        navigation.navigate("SubmitSuccess");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  return (
    <RRAppWrapper style={{ backgroundColor: colors.Athens_Gray }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.addVideoCntnr}>
            {/* {reviewRequest?.videoUrl && (
              <Video
                source={{ uri: S3_URL + reviewRequest?.videoUrl }}
                style={[
                  {
                    width: scaleSize(279),
                    aspectRatio: 9 / 16,
                    borderRadius: 16,
                  },
                ]}
                rate={1.0}
                isMuted={false}
                resizeMode="contain"
                volume={0.5}
                shouldPlay
                
              />
            )} */}
            <Image
              style={{ width: 300, height: 500 }}
              // style={styles.tinyLogo}
              source={{ uri: S3_URL + reviewRequest?.imageUrl }}
            />
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
    fontFamily: "karla",
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
    fontFamily: "karla",
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
    fontFamily: "karla",
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
});
