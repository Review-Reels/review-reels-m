import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper } from "components";
import * as React from "react";
import {
  Button,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Share,
} from "react-native";
import { RootStackParamList } from "types";
import Close from "assets/svg/Close.svg";
import ShareIcon from "assets/svg/Share.svg";
import Copy from "assets/svg/Copy.svg";
import Email from "assets/svg/Email.svg";
import colors from "constants/colors";
import { scaleSize } from "constants/layout";
import * as Clipboard from "expo-clipboard";

export default function ShareRequestScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const onPressShare = async () => {
    try {
      const result = await Share.share({
        message: "https://reviewreels.com/carnival",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onPressCopy = () => {
    Clipboard.default.setString("https://reviewreels.com/carnival");
  };

  const onPressClose = () => {
    navigation.goBack();
  };

  return (
    <RRAppWrapper style={styles.container}>
      <View>
        <View style={styles.headerCntnr}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Your ask message is saved here</Text>
            <Pressable onPress={onPressClose}>
              {Platform.OS == "web" ? (
                <img style={{ width: 48, height: 48 }} src={Close}></img>
              ) : (
                <Close width={32} height={32}></Close>
              )}
            </Pressable>
          </View>
          <Text style={styles.infoText}>
            Share your message with customers to collect reviews
          </Text>
          <View style={styles.headerActionsCntnr}>
            <Pressable style={styles.headerAction}>
              <Text style={styles.headerActionTxt}>Edit</Text>
            </Pressable>
            <Pressable style={styles.headerAction}>
              <Text style={styles.headerActionTxt}>Preview</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.shareCntnr}>
          <View style={styles.linkShareCntnr}>
            <Text style={styles.shareHeaderTxt}>SHARE USING LINK</Text>
            <Text style={styles.shareLinkTxt}>
              https://reviewreels.com/carn..
            </Text>
            <Text style={styles.infoText}>
              Your ask message is available on the above link, share with
              customers to get reviews.
            </Text>
            <View style={styles.actionsCntnr}>
              <Pressable style={styles.action} onPress={onPressShare}>
                {Platform.OS == "web" ? (
                  <img
                    style={{ width: 20, height: 20, marginRight: 4 }}
                    src={ShareIcon}
                  ></img>
                ) : (
                  <ShareIcon
                    style={{ marginRight: 4 }}
                    width={20}
                    height={20}
                  ></ShareIcon>
                )}
                <Text style={styles.actionTxt}>Share</Text>
              </Pressable>
              <Pressable style={styles.action} onPress={onPressCopy}>
                {Platform.OS == "web" ? (
                  <img
                    style={{ width: 20, height: 20, marginRight: 4 }}
                    src={Copy}
                  ></img>
                ) : (
                  <Copy
                    style={{ marginRight: 4 }}
                    width={20}
                    height={20}
                  ></Copy>
                )}
                <Text style={styles.actionTxt}>Copy Link</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.emailShareCntnr}>
            <Text style={styles.shareHeaderTxt}>SHARE USING EMAILS</Text>
            <Text style={styles.infoText}>
              Send emails to your contact list with the ask message and let them
              reply with reviews. Also, you can follow-up later.
            </Text>
            <View style={styles.actionsCntnr}>
              <Pressable style={styles.action}>
                {Platform.OS == "web" ? (
                  <img
                    style={{ width: 20, height: 20, marginRight: 4 }}
                    src={Email}
                  ></img>
                ) : (
                  <Email
                    style={{ marginRight: 4 }}
                    width={20}
                    height={20}
                  ></Email>
                )}
                <Text style={styles.actionTxt}>Send Emails</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCntnr: {
    backgroundColor: colors.Peach_Cream,
    padding: 24,
    paddingTop: 48,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "karla",
    flexWrap: "wrap",
    width: scaleSize(224),
    lineHeight: 32,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "karla",
    color: colors.Black2,
    marginTop: 8,
  },
  shareCntnr: {
    paddingHorizontal: 24,
    marginTop: -48,
  },
  linkShareCntnr: {
    backgroundColor: colors.Anakiwa,
    borderRadius: 12,
    padding: 24,
  },
  emailShareCntnr: {
    backgroundColor: colors.SweetPink,
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
  },
  shareHeaderTxt: {
    fontSize: 12,
    fontFamily: "karla",
    lineHeight: 16,
    fontWeight: "700",
    color: colors.Black2,
  },
  shareLinkTxt: {
    fontSize: 20,
    fontFamily: "karla",
    lineHeight: 24,
    color: colors.Charade,
    marginTop: 8,
  },
  headerActionsCntnr: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 48,
  },
  actionsCntnr: {
    flexDirection: "row",
    marginTop: 16,
  },
  action: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.Black4,
    borderRadius: 24,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  actionTxt: {
    color: colors.White,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "karla",
  },
  headerAction: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.Black4,
    borderRadius: 24,
    marginRight: 8,
  },
  headerActionTxt: {
    color: colors.Black2,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "karla",
  },
});
