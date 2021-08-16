import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ClosePlain from "assets/svg/ClosePlain.svg";
import AddPhoto from "assets/svg/AddPhoto.svg";
import VideoTimer from "assets/svg/VideoTimer.svg";
import VideoInfo1 from "assets/svg/VideoInfo1.svg";
import VideoInfo2 from "assets/svg/VideoInfo2.svg";
import colors from "constants/Colors";
import { scaleSize } from "constants/Layout";

export default function MerchantVideoInfo({
  onPressClose,
  onPressOk,
}: {
  onPressClose: any;
  onPressOk: any;
}) {
  return (
    <View style={styles.videoInfoCntnr}>
      <View style={styles.videoInfoTxtCntnr}>
        <Pressable style={{ alignSelf: "flex-end" }} onPress={onPressClose}>
          {Platform.OS == "web" ? (
            <img style={{ width: 24, height: 24 }} src={ClosePlain}></img>
          ) : (
            <ClosePlain width={24} height={24}></ClosePlain>
          )}
        </Pressable>
        <View style={styles.videoInfoRow1}>
          {Platform.OS == "web" ? (
            <img style={{ width: 40, height: 40 }} src={VideoTimer}></img>
          ) : (
            <VideoTimer width={40} height={40}></VideoTimer>
          )}
          <Text style={[styles.videoInfoText]}>
            You can reply with a short video of duration less than 30 seconds
          </Text>
        </View>
        <View style={styles.videoInfoRow}>
          <View>
            {Platform.OS == "web" ? (
              <img style={{ width: 40, height: 40 }} src={VideoInfo1}></img>
            ) : (
              <VideoInfo1 width={40} height={40}></VideoInfo1>
            )}
          </View>
          <View>
            <Text style={styles.videoInfoText}>
              Please try to keep it on point, so that your customers get it
              easily.
            </Text>
          </View>
        </View>
        <View style={styles.videoInfoRow}>
          <View>
            {Platform.OS == "web" ? (
              <img style={{ width: 40, height: 40 }} src={VideoInfo2}></img>
            ) : (
              <VideoInfo2 width={40} height={40}></VideoInfo2>
            )}
          </View>
          <View>
            <Text style={styles.videoInfoText}>
              You can upload a video from phone or you can make one in next step
            </Text>
          </View>
        </View>
        <Pressable style={styles.videoInfoAction} onPress={onPressOk}>
          <Text style={styles.videoInfoActionTxt}>Okay, Got it!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  videoInfoCntnr: {
    left: 0,
    right: 0,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: colors.Black5,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  videoInfoTxtCntnr: {
    backgroundColor: colors.Peach_Cream,
    paddingLeft: 44,
    paddingTop: 30,
    paddingRight: 30,
    paddingBottom: 40,
    borderRadius: 16,
  },
  videoInfoRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  videoInfoRow: {
    marginTop: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  videoInfoText: {
    width: scaleSize(167),
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Karla-Bold",
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
    fontFamily: "Karla-Bold",
  },
});
