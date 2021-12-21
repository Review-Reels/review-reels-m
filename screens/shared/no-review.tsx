import * as React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Chat from "assets/svg/Chat.svg";

export default function NoReview() {
  return (
    <View style={styles.chatCntnr}>
      {Platform.OS == "web" ? (
        <img height={160} width={160} src={Chat}></img>
      ) : (
        <Chat style={styles.chat}></Chat>
      )}
      <Text style={styles.chatTxt}>
        All reviews you have received will be shown here. You can always ask
        more and get more reviews
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chatCntnr: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  chatTxt: {
    textAlign: "center",
    fontFamily: "Karla",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  chat: {
    width: 160,
    height: 160,
  },
});
