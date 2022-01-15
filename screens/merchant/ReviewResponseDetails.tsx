import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";
import ThreeDotVertical from "assets/svg/ThreeDotVertical.svg";
import Back from "assets/svg/Back.svg";

import { RRAppWrapper } from "components";
import colors from "constants/Colors";
import { getElapsedTime } from "utils/daysJsUtils";
import { scaleSize } from "constants/Layout";
import PlayButton from "assets/svg/PlayButton.svg";
import VideoCam from "assets/svg/VideoCam.svg";
import { useToast } from "native-base";

import { authContext } from "context/AuthContext";
import { set, SET_LOADER } from "context/authActions";
import emailClient from "services/api/email-client";

export default function ReviewResponseDetails({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewResponse, setReviewResponse] = React.useState({});
  const [reviewRequest, setReviewRequest] = React.useState({});
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  const { authDispatch } = React.useContext<any>(authContext);
  const toast = useToast();

  const sendEmailAgain = (id) => {
    if (reviewResponse.EmailTracker[0].status === false) {
      authDispatch(set(SET_LOADER, true));
      emailClient
        .reSendMail({ id: id })
        .then(
          (res) => {
            toast.show({ title: "Emails sent successfully" });
            navigation.replace("Home");
          },
          (err) => {
            toast.show({ title: "Something went wrong" });
          }
        )
        .finally(() => {
          authDispatch(set(SET_LOADER, false));
        });
    }
  };

  React.useEffect(() => {
    setReviewResponse(route.params.reviewResponse);
    setReviewRequest(route.params.reviewRequest);
  }, [route]);

  const reviewResponseRecieved =
    Object.values(reviewResponse).length > 0 &&
    reviewResponse?.EmailTracker &&
    reviewResponse.EmailTracker.length > 0;

  const responseEmail =
    reviewResponseRecieved && reviewResponse.EmailTracker[0];

  return (
    <RRAppWrapper>
      <View>
        <View style={styles.header}>
          <View style={styles.nameAndBack}>
            <Pressable onPress={() => navigation.goBack()}>
              {Platform.OS == "web" ? (
                <img style={{ marginRight: 16 }} src={Back}></img>
              ) : (
                <Back style={styles.back}></Back>
              )}
            </Pressable>
            <View>
              <Text style={styles.title}>
                {(reviewResponseRecieved && responseEmail.customerName) ||
                  reviewResponse.customerName}
              </Text>
              <Text style={styles.designationTxt}>
                {(reviewResponseRecieved && responseEmail.whatYouDo) ||
                  reviewResponse.whatYouDo}
              </Text>
            </View>
          </View>
          {Platform.OS == "web" ? (
            <img style={{ width: 4, height: 16 }} src={ThreeDotVertical}></img>
          ) : (
            <ThreeDotVertical style={styles.threeDot}></ThreeDotVertical>
          )}
        </View>
        {reviewResponseRecieved && responseEmail.status === false && (
          <View style={{ display: "flex" }}>
            <Text style={styles.sendFailedTxt}>Email Send Failed!</Text>
          </View>
        )}
        <ScrollView>
          {reviewResponseRecieved && (
            <View style={styles.inputView}>
              <View style={styles.contentContainer}>
                <View style={styles.addVideoCntnr}>
                  <Pressable style={styles.overlay}>
                    {reviewRequest.imageUrl && (
                      <Image
                        style={styles.rounded}
                        source={{ uri: S3_URL + reviewRequest.imageUrl }}
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
                    <Text style={styles.requestMsgTxt}>
                      {reviewRequest.askMessage}
                    </Text>
                  </View>
                  <View style={{ alignSelf: "center" }}>
                    <Pressable
                      style={{
                        ...styles.button,
                        opacity: responseEmail.status === true ? 0.2 : 1,
                      }}
                      onPress={() => sendEmailAgain(responseEmail.id)}
                    >
                      {Platform.OS == "web" ? (
                        <img src={VideoCam}></img>
                      ) : (
                        <VideoCam></VideoCam>
                      )}
                      {responseEmail.status === true ? (
                        <Text style={styles.buttonTxt}>Reply with Video</Text>
                      ) : (
                        <Text style={styles.buttonTxt}>Send Again</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.container}>
            {reviewResponse.videoUrl !== "" && (
              <Pressable
                onPress={() =>
                  navigation.navigate("PublishReview", {
                    videoUrl: S3_URL + reviewResponse.videoUrl,
                  })
                }
              >
                <View style={styles.overlay}>
                  <Image
                    style={styles.rounded}
                    source={{ uri: S3_URL + reviewResponse?.imageUrl }}
                  />
                  {Platform.OS == "web" ? (
                    <img
                      src={PlayButton}
                      style={{ position: "absolute", top: "50%", left: "40%" }}
                    />
                  ) : (
                    <PlayButton
                      style={{ position: "absolute", top: "50%", left: "40%" }}
                    ></PlayButton>
                  )}
                </View>
              </Pressable>
            )}
            <Text style={styles.timeTxt}>
              {getElapsedTime(reviewResponse.createdAt)}
            </Text>
          </View>
        </ScrollView>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Karla-Bold",
    fontWeight: "bold",
  },
  designationTxt: {
    fontSize: 14,
    // lineHeight: 24,
    fontFamily: "Karla-Bold",
    fontWeight: "500",
    color: colors.Black2,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: "80%",
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.Dove_Grey,
    paddingBottom: 20,
    marginBottom: 20,
  },
  threeDot: {
    width: 4,
    height: 16,
  },
  nameAndBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    marginRight: 16,
  },
  rounded: {
    width: scaleSize(240),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    height: 450,
  },
  overlay: {
    width: 231,
    height: 450,
    marginBottom: 8,
  },
  timeTxt: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Karla",
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
    margin: 24,
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
  },
  addVideoCntnr: {
    backgroundColor: colors.White,
    borderRadius: 16,
  },
  requestMsgCntnr: {
    marginTop: 24,
  },
  requestMsgTxt: {
    fontFamily: "Karla",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    textAlign: "justify",
  },
  video: {
    borderRadius: 16,
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
  sendFailedTxt: {
    textAlign: "center",
    color: colors.Alizarin_Crimson,
    fontFamily: "Karla",
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "700",
  },
});
