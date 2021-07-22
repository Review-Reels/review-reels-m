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

  const hideBtn = () => {
    setBtnStatus(false);
  };

  const showBtn = () => {
    setBtnStatus(true);
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
    }
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
          <View style={styles.mainContainer}>
            <Video
              source={{
                uri: "https://www.videvo.net/video/flat-lay-panning-close-up-saxophone-keys/531731/",
              }}
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
            onCapture={(video: any) => {
              // setCameraStatus(false);
              setVideo(video);
              setShowCustomerInfo(true);
            }}
          ></RRCamera>
        )}
        {isShowInfoTxt && (
          <CustomerVideoInfo
            onPressClose={() => {
              setShowInfoTxt(false);
            }}
            onPressOk={() => {
              setShowInfoTxt(false);
              setOpenStatus(true);
              // setShowCustomerInfo(true);
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
