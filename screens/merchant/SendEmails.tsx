import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper, RRTextInput } from "components";
import { S3_URL } from "constants/apiUrls";
import * as React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Close from "assets/svg/Close.svg";
import { RootStackParamList } from "types";
import { scaleSize } from "constants/Layout";
import colors from "constants/Colors";
import PlayButton from "assets/svg/PlayButton.svg";
import VideoCam from "assets/svg/VideoCam.svg";

export default function SendEmails({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = React.useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [image, setImage] = React.useState(null);
  const [subject, setSubject] = React.useState<string>("");
  React.useEffect(() => {
    if (route.params) {
      console.log(route.params);
      setRequestMessage(route.params.askMessage);
      setImage(route.params.imageUrl);
    }
  }, [route]);

  return (
    <RRAppWrapper style={{ padding: 24 }}>
      <ScrollView style={{ flex: 1, marginTop: 24, padding: 24 }}>
        <View style={styles.headerCntnr}>
          <Text style={styles.title}>Send Emails</Text>
          <Pressable onPress={() => navigation.goBack()}>
            {Platform.OS == "web" ? (
              <img style={{ width: 48, height: 48 }} src={Close}></img>
            ) : (
              <Close width={48} height={48}></Close>
            )}
          </Pressable>
        </View>
        <View style={styles.inputCntnr}>
          <Text style={styles.label}>TO</Text>
          <View style={[styles.inputView, styles.emailTo]}></View>
        </View>
        <RRTextInput
          label="SUBJECT"
          value={subject}
          onChangeText={(val: string) => setSubject(val)}
          placeholder="eg:nickfury"
          //   error={usernameError}
        ></RRTextInput>
        <View style={styles.inputCntnr}>
          <Text style={styles.label}>CONTENT</Text>
          <View style={styles.inputView}>
            <View style={styles.contentContainer}>
              <View style={styles.addVideoCntnr}>
                <Pressable style={styles.overlay}>
                  {image && (
                    <Image
                      style={styles.rounded}
                      source={{ uri: S3_URL + image }}
                    />
                  )}
                  {Platform.OS == "web" ? (
                    <img
                      src={PlayButton}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                      }}
                    />
                  ) : (
                    <PlayButton
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                      }}
                    ></PlayButton>
                  )}
                </Pressable>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={styles.requestMsgCntnr}>
                  <Text style={styles.requestMsgTxt}>{requestMessage}</Text>
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
            </View>
          </View>
        </View>
      </ScrollView>
    </RRAppWrapper>
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
  contentContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 16,
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
  label: {
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
    fontFamily: "Karla-Bold",
    marginBottom: 8,
    color: colors.Black2,
  },
  inputCntnr: {
    marginVertical: 24,
  },
  inputView: {
    borderRadius: 16,
    backgroundColor: colors.Concrete,
    marginTop: 8,
    padding: 24,
  },
  emailTo: {
    minHeight: 60,
    borderRadius: 16,
    width: "100%",
  },
  addVideoCntnr: {
    backgroundColor: colors.White,
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 24,
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
    width: scaleSize(231),
    aspectRatio: 9 / 16,
    borderRadius: 16,
    alignSelf: "center",
  },
  overlay: {
    width: 231,
    height: 450,
    marginBottom: 8,
  },
});
