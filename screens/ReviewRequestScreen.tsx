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

export default function ReviewRequestScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowBtn, setBtnStatus] = useState(true);
  const [isOpenCamera, setCameraStatus] = useState(false);
  const [isShowInfoTxt, setShowInfoTxt] = useState(false);
  const [isOpen, setOpenStatus] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", hideBtn);
    Keyboard.addListener("keyboardDidHide", showBtn);

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

  return (
    <RRAppWrapper>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.headerCntnr}>
            <Text style={styles.title}>Create Your Ask Message</Text>
            <Pressable>
              {Platform.OS == "web" ? (
                <img style={{ width: 48, height: 48 }} src={Close}></img>
              ) : (
                <Close width={32} height={32}></Close>
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
              onPress={() => setOpenStatus(true)}
            >
              {Platform.OS == "web" ? (
                <img style={{ width: 32, height: 32 }} src={AddPhoto}></img>
              ) : (
                <AddPhoto width={32} height={32}></AddPhoto>
              )}
              <Text style={styles.addVideoTxt}>Add a Video or Image</Text>
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
            <Actionsheet.Item>Choose from Gallery</Actionsheet.Item>
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
