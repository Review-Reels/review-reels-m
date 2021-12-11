import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList, SignupPayload, googleSignUpPayload } from "types";

import { RRAppWrapper, RRTextInput } from "_components";
import Logo from "assets/svg/Logo.svg";
import colors from "constants/Colors";
import RRButton from "components/RRButton";
import userClient from "services/api/user-client";

import { authContext } from "context/AuthContext";
import { set, SET_LOADER, SET_TOKEN, SET_USER } from "context/authActions";

export default function EmailSignInScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [email, setEmail] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  const { authDispatch } = React.useContext(authContext);
  const emailSignin = async () => {
    authDispatch(set(SET_LOADER, true));
    try {
      const signedInUser = await userClient.emailSignIn({ email, password });
      if (signedInUser && signedInUser.data) saveAuthDetails(signedInUser.data);
    } catch (err) {
      if (err.response.data.message.includes("Password"))
        setPasswordError(err.response.data.message);
      else if (err.response.data.message.includes("User"))
        setEmailError("Email wrong");
    } finally {
      authDispatch(set(SET_LOADER, false));
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoCntnr}>
            {Platform.OS == "web" ? <img src={Logo}></img> : <Logo></Logo>}
          </View>
          <View style={{ flex: 2 }}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={styles.statement}>Sign In</Text>
            </View>
            <View style={{ justifyContent: "flex-start", minWidth: 300 }}>
              <RRTextInput
                label="EMAIL"
                value={email}
                onChangeText={(val: string) => {
                  setEmail(val);
                  setEmailError("");
                }}
                placeholder="eg:nickfury"
                error={emailError}
              ></RRTextInput>
              <View style={{ marginTop: 24 }}></View>
              <RRTextInput
                label="PASSWORD"
                password={true}
                value={password}
                onChangeText={(val: string) => {
                  setPassword(val);
                  setPasswordError("");
                }}
                placeholder="eg:Avengers Inc."
                error={passwordError}
              ></RRTextInput>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <RRButton
                style={{ width: 150, marginRight: 10 }}
                mode="cancel"
                title="Cancel"
                onPress={() => navigation.goBack()}
              ></RRButton>
              <RRButton
                style={{ width: 150 }}
                title="Sign In"
                onPress={() => emailSignin()}
              ></RRButton>
            </View>
          </View>
        </ScrollView>
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
});
