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
} from "react-native";
import { RootStackParamList } from "types";
import Logo from "assets/svg/Logo.svg";
import Statement from "assets/svg/Statement.svg";
import RRButton from "components/RRButton";
import * as Google from "expo-google-app-auth";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
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
        const { type, user } = await Google.logInAsync(config);

        if (type === "success") {
          // Then you can use the Google REST API
          navigation.navigate("Home");
        }
      } catch (error) {
        console.log("LoginScreen.js 19 | error with login", error);
      }
  };
  return (
    <RRAppWrapper>
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
          <Text style={styles.signInTxt}>
            By signing up you agree to our terms and conditions
          </Text>
        </View>
      </ScrollView>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
});
