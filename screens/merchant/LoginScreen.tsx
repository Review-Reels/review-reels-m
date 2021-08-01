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
import { set, SET_TOKEN, SET_USER } from "context/authActions";
import { GoogleLogin } from "react-google-login";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [payLoad, setPayload] = React.useState<SignupPayload>();
  const [isEnterUsername, setIsUsername] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [isShowBtn, setBtnStatus] = React.useState(true);

  const { authState, authDispatch } = React.useContext(authContext);

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
    } else
      try {
        const config: Google.GoogleLogInConfig = {
          clientId: `821902754014-fm9npqchn7ja27eagrrr76bk91ikspsg.apps.googleusercontent.com`,
          iosClientId: `821902754014-47rd60g2ltm6dj6kl7dmvd5k9kdf0ctj.apps.googleusercontent.com`,
          androidClientId: `821902754014-d7ssa6q6d21ebo0q069co91dk4bs288k.apps.googleusercontent.com`,
        };
        const {
          type,
          user,
          accessToken,
          refreshToken,
          idToken,
        }: Google.LogInResult = await Google.logInAsync(config);
        if (type === "success") {
          setPayload({
            username: "",
            email: user.email,
            name: user.name,
            givenName: user.givenName,
            familyName: user.familyName,
            photoUrl: user.photoUrl,
            accessToken: accessToken,
            refreshToken: refreshToken,
            idToken: idToken,
          });
          console.log(idToken);
          googleSignInSignUp(idToken);
        }
      } catch (error) {
        console.log("LoginScreen.js 19 | error with login", error);
      }
  };

  const proceedSignin = async () => {
    // let data = {
    //   email: "hari@gmail.com",
    //   name: "Hariprasad K B",
    //   password: "thisis@complecated",
    //   username: "newuser",
    // };
    try {
      const updatedUser = await userClient.updateUser({ username });
      console.log(updatedUser.data);
      if (updatedUser) {
        const authToken = await AsyncStorage.getItem("@token");
        authDispatch(set(SET_TOKEN, authToken));
      }
    } catch (e) {
      console.log(e);
    }
    // userClient.signUp(data).then((response) => {
    //   navigation.navigate("Home");
    // });
  };
  const responseGoogle = (response) => {
    console.log(response.tokenObj.id_token);
    googleSignInSignUp(response.tokenObj.id_token);
  };

  const googleSignInSignUp = async (idToken: string) => {
    try {
      const signedInUser = await userClient.googleSignIn({ idToken });
      console.log(signedInUser.data);
      await AsyncStorage.setItem("@token", signedInUser.data.Authorization);
      await AsyncStorage.setItem("@user", JSON.stringify(signedInUser.data));
      authDispatch(set(SET_USER, signedInUser.data));
      if (!signedInUser.data.username) {
        setIsUsername(true);
      } else {
        authDispatch(set(SET_TOKEN, signedInUser.data.Authorization));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <RRAppWrapper style={{ flex: 1, padding: 24 }}>
      <>
        {isEnterUsername ? (
          <View style={{ flex: 1, marginTop: 24 }}>
            <Text style={styles.title}>Create Username</Text>
            <Text style={styles.userNameTxt}>
              Please choose a username unique to your brand, that your customers
              can identify easily.
            </Text>
            <RRTextInput
              label="USERNAME"
              value={username}
              onChangeText={(val: string) => setUsername(val)}
              placeholder="eg:barandonstore"
            ></RRTextInput>
            {isShowBtn && (
              <View
                style={{ position: "absolute", bottom: 0, alignSelf: "center" }}
              >
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
                    // <button
                    //   onClick={renderProps.onClick}
                    //   disabled={renderProps.disabled}
                    // >
                    //   This is my custom Google button
                    // </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
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
});
