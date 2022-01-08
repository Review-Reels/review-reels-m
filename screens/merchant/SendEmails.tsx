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
import ClosePlain from "assets/svg/ClosePlain.svg";
import { RootStackParamList } from "types";
import { scaleSize } from "constants/Layout";
import colors from "constants/Colors";
import PlayButton from "assets/svg/PlayButton.svg";
import VideoCam from "assets/svg/VideoCam.svg";
import CustomerEmailInfo from "screens/shared/customer-email-info";
import { LinearGradient } from "expo-linear-gradient";
import RRButton from "components/RRButton";
import emailClient from "services/api/email-client";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER } from "context/authActions";
import { useToast } from "native-base";

export type recepientType = {
  customerName: string;
  email: string;
};

export default function SendEmails({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = React.useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [image, setImage] = React.useState(null);
  const [isShowCustomerEmailInfo, setCustomerInfo] = React.useState(false);
  const [toEmailList, setToEmailList] = React.useState<Array<recepientType>>(
    []
  );
  const [subject, setSubject] = React.useState<string>("");
  const [subjectError, setSubjectError] = React.useState<string>("");
  const [emailListError, setEmailListError] = React.useState<string>("");
  const [reviewRequestId, setRequestId] = React.useState<string>("");
  const { authDispatch } = React.useContext(authContext);
  const toast = useToast();

  React.useEffect(() => {
    if (route.params) {
      setRequestId(route.params.id);
      setRequestMessage(route.params.askMessage);
      setImage(route.params.imageUrl);
    }
  }, [route]);

  const onAddCustomerInfo = (info: recepientType) => {
    setEmailListError("");
    let mailList = JSON.parse(JSON.stringify(toEmailList));
    mailList.push(info);
    setToEmailList(mailList);
  };

  const onDeleteToEmail = (index: number) => {
    const newMailList = [...toEmailList];
    newMailList.splice(index, 1);
    setToEmailList(newMailList);
  };

  const onPressProceed = () => {
    setEmailListError("");
    setSubjectError("");
    if (toEmailList.length === 0) {
      setEmailListError("Customers be blank");
      return;
    }
    if (!subject) {
      setSubjectError("Subject cannot be blank");
      return;
    }
    const emailDuplicateCheckList = toEmailList.map((item) => item.email);
    const emailDuplicateCheckMap = new Set(emailDuplicateCheckList);
    console.log(emailDuplicateCheckMap.size, emailDuplicateCheckList.length);
    if (emailDuplicateCheckMap.size < emailDuplicateCheckList.length) {
      setEmailListError("You have same email id for two or more customers");
      return;
    }
    authDispatch(set(SET_LOADER, true));
    emailClient
      .sendEmail({ subject, sendTo: toEmailList, reviewRequestId })
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
  };

  return (
    <RRAppWrapper>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {isShowCustomerEmailInfo && (
            <Pressable
              onPress={() => setCustomerInfo(false)}
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                backgroundColor: colors.Black4,
                zIndex: 9,
              }}
            ></Pressable>
          )}
          <ScrollView style={[{ flex: 1, padding: 24 }]}>
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
              <View style={[styles.emailToContainer, styles.emailTo]}>
                {toEmailList.map((item, i) => {
                  return (
                    <View key={i} style={styles.toItem}>
                      <Text style={styles.toItemText}>{item.customerName}</Text>
                      <Pressable
                        onPress={() => onDeleteToEmail(i)}
                        style={styles.toItemIcon}
                      >
                        {Platform.OS == "web" ? (
                          <img
                            style={{ width: 20, height: 20 }}
                            src={ClosePlain}
                          ></img>
                        ) : (
                          <ClosePlain width={20} height={20}></ClosePlain>
                        )}
                      </Pressable>
                    </View>
                  );
                })}

                <Pressable
                  onPress={() => setCustomerInfo(true)}
                  style={styles.toItem}
                >
                  <Text style={styles.toItemText}>Add Customers</Text>
                </Pressable>
              </View>
              {<Text style={styles.errorTxt}>{emailListError}</Text>}
            </View>
            <RRTextInput
              label="SUBJECT"
              value={subject}
              onChangeText={(val: string) => {
                setSubject(val);
                setSubjectError("");
              }}
              placeholder="eg:nickfury"
              error={subjectError}
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

          <LinearGradient
            style={styles.buttonGradient}
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          >
            <View style={styles.proceedBtnCntnr}>
              <RRButton title="Send Emails" onPress={onPressProceed}></RRButton>
            </View>
          </LinearGradient>
        </View>
        {
          <CustomerEmailInfo
            visible={isShowCustomerEmailInfo}
            onPressProceed={(info: any) => onAddCustomerInfo(info)}
            onPressClose={() => {
              setCustomerInfo(false);
            }}
          ></CustomerEmailInfo>
        }
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  proceedBtnCntnr: {
    alignSelf: "center",
    marginBottom: 24,
  },
  buttonGradient: {
    height: 200,
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
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
  emailToContainer: {
    borderRadius: 16,
    backgroundColor: colors.Concrete,
    marginTop: 8,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
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
  toItem: {
    paddingLeft: 24,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: colors.Black4,
    borderRadius: 64,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    marginHorizontal: 4,
  },
  toItemIcon: {
    marginLeft: 8,
  },
  toItemText: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    fontFamily: "Karla",
    color: colors.Black2,
  },
  errorTxt: {
    color: "red",
    fontSize: 12,
    marginTop: 8,
  },
});
