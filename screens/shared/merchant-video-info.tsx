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

import Close from "assets/svg/Close.svg";
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
            You can reply with a short video of duration less than 30 seconds
          </Text>
        </View>
        <View style={styles.videoInfoRow}>
          <View>
            {Platform.OS == "web" ? (
              <img style={{ width: 48, height: 48 }} src={VideoInfo1}></img>
            ) : (
              <VideoInfo1 width={48} height={48}></VideoInfo1>
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
              <img style={{ width: 48, height: 48 }} src={VideoInfo2}></img>
            ) : (
              <VideoInfo2 width={48} height={48}></VideoInfo2>
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
    padding: 20,
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
