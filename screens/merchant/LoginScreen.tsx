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
} from "react-native";
import { RootStackParamList, SignupPayload, googleSignUpPayload } from "types";
import Logo from "assets/svg/Logo.svg";
import Statement from "assets/svg/Statement.svg";
import RRButton from "components/RRButton";
import * as Google from "expo-google-app-auth";
import userClient from "services/api/user-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER, SET_TOKEN, SET_USER } from "context/authActions";
import { GoogleLogin } from "react-google-login";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [payLoad, setPayload] = React.useState<SignupPayload>();
  const [isEnterUsername, setIsUsername] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [merchantName, setMerchantName] = React.useState<string>("");
  const [merchantNameError, setMerchantNameError] = React.useState<string>("");
  const [isShowBtn, setBtnStatus] = React.useState(true);
  const { authState, authDispatch } = React.useContext(authContext);
  const [userDetails, setUserDetails] = React.useState<any>();

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", hideBtn);
    Keyboard.addListener("keyboardDidHide", showBtn);
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

  const signInAsync = async () => {
    if (Platform.OS == "web") {
      proceedSignin();
    } else {
      const config: Google.GoogleLogInConfig = {
        clientId: `821902754014-fm9npqchn7ja27eagrrr76bk91ikspsg.apps.googleusercontent.com`,
        iosClientId: `821902754014-47rd60g2ltm6dj6kl7dmvd5k9kdf0ctj.apps.googleusercontent.com`,
        androidClientId: `821902754014-d7ssa6q6d21ebo0q069co91dk4bs288k.apps.googleusercontent.com`,
      };
      const { type, idToken }: Google.LogInResult = await Google.logInAsync(
        config
      );
      if (type === "success") {
        googleSignInSignUp(idToken);
      }
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
            {isShowBtn && (
              <View style={styles.proceedBtn}>
                <RRButton
                  style={styles.button}
                  title="Proceed"
                  onPress={() => proceedSignin()}
                ></RRButton>
              </View>
            )}
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={{ position: "absolute", top: 48 }}>
              {Platform.OS == "web" ? <img src={Logo}></img> : <Logo></Logo>}
            </View>
            <View style={{ position: "absolute", bottom: 0 }}>
              <View style={styles.statementCntnr}>
                {Platform.OS == "web" ? (
                  <img src={Statement}></img>
                ) : (
                  <Statement></Statement>
                )}
              </View>
              {Platform.OS === "web" ? (
                <GoogleLogin
                  clientId="821902754014-fm9npqchn7ja27eagrrr76bk91ikspsg.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <RRButton
                      style={styles.button}
                      title="Connect with Google"
                      onPress={renderProps.onClick}
                    ></RRButton>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={onGoogleLoginFailed}
                  cookiePolicy={"single_host_origin"}
                />
              ) : (
                <RRButton
                  style={styles.button}
                  title="Connect with Google"
                  onPress={() => signInAsync()}
                ></RRButton>
              )}

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
  logoCntnr: {},
  statementCntnr: {
    marginTop: 185,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    width: 270,
    marginTop: 24,
  },
  signInTxt: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: "karla",
    width: 200,
    marginTop: 24,
    marginBottom: 24,
    alignSelf: "center",
    textAlign: "center",
  },
  userNameTxt: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: "karla",
    marginTop: 24,
    marginBottom: 24,
  },
  proceedBtn: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
});
