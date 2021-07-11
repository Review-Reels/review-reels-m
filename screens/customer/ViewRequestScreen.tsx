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

import { scaleSize } from "constants/layout";
import { Actionsheet, useDisclose } from "native-base";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "types";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus } from "expo-av";
import CustomerVideoInfo from "screens/shared/customer-video-info";
import CaptureActionSheet from "screens/shared/capture-action-sheet";
import CustomerInfo from "screens/shared/customer-info";

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
  const [isShowCustomerInfo, setShowCustomerInfo] = useState(false);
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

  const pickVideo = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    // console.log(result);
    // if (!result.cancelled) {
    //   console.log(result);
    //   // setImage(result.uri);
    // }
  };

  const onPressReply = () => {
    setShowInfoTxt(true);
  };

  const onProceedCustomerInfo = (info: any) => {
    setShowCustomerInfo(false);
    navigation.replace("SubmitSuccess");
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
              <Text style={styles.requestMsgTxt}>
                Hi, This is Mariya form Carnival Collections. Hope you enjoyed
                using our products. It will be great if you can tell us how much
                you like our products with a short video.
              </Text>
            </View>
            <RRButton
              style={styles.mt_24}
              onPress={onPressReply}
              title="Reply with Video"
            ></RRButton>
          </View>
        </ScrollView>
        {isOpen && (
          <CaptureActionSheet
            onClose={() => {
              setOpenStatus(false);
            }}
            onPressCamera={() => {
              setOpenStatus(false);
              setCameraStatus(true);
            }}
            onPressGallery={() => {
              setOpenStatus(false);
              pickVideo();
            }}
          ></CaptureActionSheet>
        )}
        {isOpenCamera && (
          <RRCamera
            isOpen={isOpenCamera}
            onClose={() => setCameraStatus(false)}
            onCapture={() => setCameraStatus(false)}
          ></RRCamera>
        )}
        {isShowInfoTxt && (
          <CustomerVideoInfo
            onPressClose={() => {
              setShowInfoTxt(false);
            }}
            onPressOk={() => {
              // setShowInfoTxt(false);
              // setOpenStatus(true);
              setShowCustomerInfo(true);
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
    paddingHorizontal: 24,
    marginTop: 40,
    backgroundColor: colors.Athens_Gray,
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
});
