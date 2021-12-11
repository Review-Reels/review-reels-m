import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper, RRTextInput } from "_components";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  ScrollView,
  Keyboard,
  Pressable,
} from "react-native";
import { RootStackParamList, SignupPayload, googleSignUpPayload } from "types";
import Logo from "assets/svg/Logo.svg";
import GoogleIcon from "assets/svg/Google.svg";
import AppleIcon from "assets/svg/Apple.svg";
import Statement from "assets/svg/Statement.svg";
import RRButton from "components/RRButton";
import * as Google from "expo-google-app-auth";
import userClient from "services/api/user-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER, SET_TOKEN, SET_USER } from "context/authActions";
import { GoogleLogin } from "react-google-login";
import colors from "constants/Colors";
import { GoogleClientId } from "constants/Google_Client";
import Email from "assets/svg/Email.svg";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [payLoad, setPayload] = React.useState<SignupPayload>();
  const [isEnterUsername, setIsUsername] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [merchantName, setMerchantName] = React.useState<string>("");
  const [merchantNameError, setMerchantNameError] = React.useState<string>("");
  const { authState, authDispatch } = React.useContext(authContext);
  const [userDetails, setUserDetails] = React.useState<any>();

  const signInAsync = async () => {
    const config: Google.GoogleLogInConfig = {
      clientId: GoogleClientId.web,
      iosClientId: GoogleClientId.ios,
      androidClientId: GoogleClientId.android,
      androidStandaloneAppClientId: GoogleClientId.androidStandalone,
      iosStandaloneAppClientId: GoogleClientId.iosStandalone,
      scopes: ["profile", "email"],
    };
    const { type, idToken }: Google.LogInResult = await Google.logInAsync(
      config
    );
    if (type === "success") {
      googleSignInSignUp(idToken);
    }
  };

  const proceedSignin = async () => {
    if (!username) {
      setUsernameError("Required");
      return;
    } else setUsernameError("");
    if (!merchantName) {
      setUsernameError("Required");
      return;
    } else setUsernameError("");
    authDispatch(set(SET_LOADER, true));
    userClient
      .updateUser({ username, merchantName }, userDetails.Authorization)
      .then(
        () => {
          let userInfo = userDetails;
          userInfo.username = username;
          userInfo.merchantName = merchantName;
          saveAuthDetails(userInfo);
          authDispatch(set(SET_LOADER, false));
        },
        (err) => {
          console.log(err.response);
          if (err.response?.data?.message)
            setUsernameError(err.response?.data?.message || "");
          authDispatch(set(SET_LOADER, false));
        }
      );
  };

  const responseGoogle = (response: any) => {
    googleSignInSignUp(response.tokenObj.id_token);
  };

  const onGoogleLoginFailed = (err: any) => {
    console.log(err);
  };

  const googleSignInSignUp = async (idToken: string) => {
    authDispatch(set(SET_LOADER, true));
    const signedInUser = await userClient.googleSignIn({ idToken });
    console.log(signedInUser);
    authDispatch(set(SET_LOADER, false));
    setUserDetails(signedInUser.data);
    if (!signedInUser.data.username || !signedInUser.data.merchantName) {
      setIsUsername(true);
    } else {
      saveAuthDetails(signedInUser.data);
    }
  };

  const saveAuthDetails = async (user: any) => {
    await AsyncStorage.setItem("@token", user.Authorization);
    await AsyncStorage.setItem("@user", JSON.stringify(user));
    authDispatch(set(SET_TOKEN, user.Authorization));
    authDispatch(set(SET_USER, user));
  };

  const getGoogleClientId = (): string => {
    switch (Platform.OS) {
      case "web":
        return GoogleClientId.web;
      case "android":
        return GoogleClientId.android;
      case "ios":
        return GoogleClientId.ios;
      default:
        return GoogleClientId.web;
    }
  };

  return (
    <RRAppWrapper style={{ flex: 1, padding: 24 }}>
      <>
        {isEnterUsername ? (
          <View style={{ flex: 1, marginTop: 24 }}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.userNameTxt}>
              Please choose a username unique to your brand, that your customers
              can identify easily.
            </Text>
            <RRTextInput
              label="USERNAME"
              value={username}
              onChangeText={(val: string) => setUsername(val)}
              placeholder="eg:nickfury"
              error={usernameError}
            ></RRTextInput>
            <View style={{ marginTop: 24 }}></View>
            <RRTextInput
              label="BUSINESS NAME"
              value={merchantName}
              onChangeText={(val: string) => setMerchantName(val)}
              placeholder="eg:Avengers Inc."
              error={merchantNameError}
            ></RRTextInput>
            <View style={styles.proceedBtn}>
              <RRButton
                style={styles.button}
                title="Proceed"
                onPress={() => proceedSignin()}
              ></RRButton>
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoCntnr}>
              {Platform.OS == "web" ? <img src={Logo}></img> : <Logo></Logo>}
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Text style={styles.statement}>
                Collect short video reviews, quickly.
              </Text>
              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate("EmailSignIn")}
              >
                {Platform.OS === "web" ? (
                  <img
                    style={{ width: 20, height: 20, marginRight: 4 }}
                    src={Email}
                  ></img>
                ) : (
                  <Email></Email>
                )}
                <Text style={styles.buttonTxt}>Continue with Email</Text>
              </Pressable>
              {Platform.OS === "web" ? (
                <GoogleLogin
                  clientId={getGoogleClientId()}
                  render={(renderProps) => (
                    <Pressable
                      style={styles.button}
                      onPress={renderProps.onClick}
                    >
                      <img src={GoogleIcon}></img>
                      <Text style={styles.buttonTxt}>Continue with Google</Text>
                    </Pressable>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={onGoogleLoginFailed}
                  cookiePolicy={"single_host_origin"}
                />
              ) : (
                <Pressable style={styles.button} onPress={() => signInAsync()}>
                  <GoogleIcon></GoogleIcon>
                  <Text style={styles.buttonTxt}>Continue with Google</Text>
                </Pressable>
              )}
              {/* <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.Black, shadowColor: colors.Black },
                ]}
              >
                {Platform.OS == "web" ? (
                  <img src={AppleIcon}></img>
                ) : (
                  <AppleIcon></AppleIcon>
                )}
                <Text style={styles.buttonTxt}>Continue with Apple</Text>
              </Pressable> */}
              <Pressable>
                <Text style={styles.emailTxt}>
                  Dont have an account?{" "}
                  <Text style={{ textDecorationLine: "underline" }}>
                    Signup
                  </Text>
                </Text>
              </Pressable>
              <Text style={[styles.signInTxt]}>
                By signing up you agree to our terms and conditions
              </Text>
            </View>
          </ScrollView>
        )}
      </>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  logoCntnr: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statement: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Karla-Bold",
    fontWeight: "700",
    marginBottom: 16,
    color: colors.Black5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Karla-Bold",
    lineHeight: 32,
    color: colors.Black5,
  },
  signInTxt: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: "Karla",
    width: 200,
    marginTop: 24,
    marginBottom: 24,
    alignSelf: "center",
    textAlign: "center",
    color: colors.Black2,
  },
  userNameTxt: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: "Karla",
    marginTop: 8,
    marginBottom: 24,
    color: colors.Black2,
  },
  proceedBtn: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    borderRadius: 64,
    paddingHorizontal: 48,
    paddingVertical: 18,
    backgroundColor: colors.Alizarin_Crimson,
    marginTop: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: colors.Alizarin_Crimson,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignSelf: "center",
  },
  buttonTxt: {
    marginLeft: 14,
    color: colors.White,
    fontFamily: "Karla-Bold",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
  },
  emailTxt: {
    textAlign: "center",
    marginTop: 24,
    fontFamily: "Karla",
    fontSize: 16,
    lineHeight: 24,
    color: colors.Black5,
  },
});
