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

export default function EmailSignUpScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [email, setEmail] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [merchantName, setMerchantName] = React.useState<string>("");
  const [merchantNameError, setMerchantNameError] = React.useState<string>("");

  const { authDispatch } = React.useContext(authContext);

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const emailSignUp = async () => {
    if (!email) {
      setEmailError("Email cannot be blank");
      return;
    } else if (validateEmail(email)) {
      setEmailError("Email not valid");
      return;
    }
    if (!password) {
      setPasswordError("Password cannot be blank");
      return;
    }
    if (!username) {
      setUsernameError("Username cannot be blank");
      return;
    }
    if (!merchantName) {
      setMerchantNameError("Merchant Name cannot be blank");
      return;
    }
    authDispatch(set(SET_LOADER, true));
    try {
      const signedInUser = await userClient.emailSignUp({
        email,
        password,
        username,
        name: merchantName,
      });
      if (signedInUser && signedInUser.data) {
        navigation.goBack();
      }
    } catch (err) {
      if (err.response.data.message.includes("username_unique"))
        setUsernameError("That username already taken. Try another");
      else if (err.response.data.message.includes("email_unique"))
        setEmailError("That email already exist.");
    } finally {
      authDispatch(set(SET_LOADER, false));
    }
  };

  return (
    <RRAppWrapper style={{ flex: 1, padding: 24 }}>
      <>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoCntnr}>
            {Platform.OS == "web" ? <img src={Logo}></img> : <Logo></Logo>}
          </View>
          <View style={{ flex: 4 }}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={styles.statement}>Sign Up</Text>
            </View>
            <View style={{ justifyContent: "flex-start", minWidth: 300 }}>
              <RRTextInput
                label="EMAIL"
                value={email}
                onChangeText={(val: string) => {
                  setEmail(val);
                  setEmailError("");
                }}
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
                error={passwordError}
              ></RRTextInput>
              <View style={{ marginTop: 24 }}></View>
              <RRTextInput
                label="USERNAME"
                value={username}
                onChangeText={(val: string) => {
                  setUsername(val);
                  setUsernameError("");
                }}
                placeholder="eg:nickfury"
                error={usernameError}
              ></RRTextInput>
              <View style={{ marginTop: 24 }}></View>
              <RRTextInput
                label="BUSINESS NAME"
                value={merchantName}
                onChangeText={(val: string) => {
                  setMerchantName(val);
                  setMerchantNameError("");
                }}
                placeholder="eg:Avengers Inc."
                error={merchantNameError}
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
                title="Sign Up"
                onPress={() => emailSignUp()}
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
