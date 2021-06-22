import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper, RRTextInput } from "_components";
import * as React from "react";
import { StyleSheet, Text, View, Button, Platform, ScrollView } from "react-native";
import { RootStackParamList } from "types";
import Logo from "assets/svg/Logo.svg";
import Statement from "assets/svg/Statement.svg";
import RRButton from "components/RRButton";

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  return (
    <RRAppWrapper>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoCntnr}>
        {
          Platform.OS=='web'?<img src={Logo}></img>:<Logo></Logo>
        }
      </View>
      <View style={styles.statementCntnr}>
        {
          Platform.OS=='web'?<img src={Statement}></img>:<Statement></Statement>
        }
      </View>      
      <RRButton style={styles.button} title="Connect with Google" onPress={() => navigation.replace("Home")}></RRButton>
      <Text style={styles.signInTxt}>By signing up you agree to our terms and conditions</Text>
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
  statementCntnr:{
    marginTop:185
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button:{
    width:270,
    marginTop:24
  },
  signInTxt:{
    fontSize:14,
    fontWeight:'400',
    lineHeight:18,
    fontFamily:'karla',
    width:200,
    marginTop:24
  }
});
