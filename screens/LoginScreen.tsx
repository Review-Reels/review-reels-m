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
import { RootStackParamList, SignupPayload } from "types";
import Logo from "assets/svg/Logo.svg";
import Statement from "assets/svg/Statement.svg";
import RRButton from "components/RRButton";
import * as Google from "expo-google-app-auth";
import userClient from "services/api/user-client";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [payLoad, setPayload] = React.useState<SignupPayload>();
  const [isEnterUsername, setIsUsername] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [isShowBtn, setBtnStatus] = React.useState(true);

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
      navigation.navigate("Home");
    } else
      try {
        const config: Google.GoogleLogInConfig = {
          clientId: `821902754014-fm9npqchn7ja27eagrrr76bk91ikspsg.apps.googleusercontent.com`,
          iosClientId: `821902754014-47rd60g2ltm6dj6kl7dmvd5k9kdf0ctj.apps.googleusercontent.com`,
          androidClientId: `821902754014-d7ssa6q6d21ebo0q069co91dk4bs288k.apps.googleusercontent.com`,
        };
        const { type, user, accessToken, refreshToken }: Google.LogInResult =
          await Google.logInAsync(config);
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
          });
          setIsUsername(true);
        }
      } catch (error) {
        console.log("LoginScreen.js 19 | error with login", error);
      }
  };

  const proceedSignin = () => {
    setPayload({
      username: "",
      email: "benkolenchery@gmai.com",
      name: "Ben Babu",
      givenName: "Ben",
      familyName: "Babu",
      photoUrl: "",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
    navigation.navigate("Home");
    // userClient.signUp(payLoad).then((response) => {
    //   console.log(response);
    //   navigation.navigate("Home");
    // });
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
              <RRButton
                style={styles.button}
                title="Connect with Google"
                onPress={() => signInAsync()}
              ></RRButton>
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
