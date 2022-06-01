import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "constants/Colors";
import Bokeh from "assets/svg/Bokeh.svg";

import LogoSmall from "assets/svg/LogoSmall.svg";

import { RootStackParamList } from "types";
import { RRAppWrapper } from "components";

export default function SubmitSuccessScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "SubmitSuccess">) {
  return (
    <RRAppWrapper>
      <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
        <View style={styles.container}>
          <View style={styles.titleIcon}>
            {Platform.OS == "web" ? <img src={Bokeh}></img> : <Bokeh></Bokeh>}
          </View>
          <Text style={styles.title}>Awesome</Text>
          <Text style={styles.content}>
            Thank you so much for your response. Hope you had a great expereince
            with
            <Text
              style={{
                fontWeight: "700",
                fontFamily: "Karla-Bold",
                marginLeft: 5,
              }}
            >
              {route.params.user.merchantName}.
            </Text>
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTxt}>Experience powered by</Text>
          {Platform.OS == "web" ? (
            <a href="www.reviewreels.app">
              <img height={32} width={100} src={LogoSmall}></img>
            </a>
          ) : (
            <LogoSmall></LogoSmall>
          )}
        </View>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    marginHorizontal: 24,
    backgroundColor: colors.Peach_Cream,
    alignSelf: "center",
    paddingBottom: 32,
    paddingTop: 64,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Karla-Bold",
  },
  titleIcon: {
    position: "absolute",
    top: -32,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Karla",
  },
  footer: {
    alignItems: "center",
    position: "absolute",
    bottom: 40,
  },
  footerTxt: {
    fontFamily: "Karla",
    fontWeight: "400",
    lineHeight: 20,
    fontSize: 14,
    color: colors.Black2,
    marginBottom: 16,
  },
});
