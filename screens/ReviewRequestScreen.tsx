import { RRAppWrapper, RRTextInput } from "components";
import * as React from "react";
import {
  Button,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "constants/colors";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import RRButton from "components/RRButton";

export default function ReviewRequestScreen() {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowBtn, setBtnStatus] = useState(true);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", hideBtn);
    Keyboard.addListener("keyboardDidHide", showBtn);

    // cleanup function
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

  return (
    <RRAppWrapper>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>Create Your Ask Message</Text>
          {/* <Close width={120} height={40}></Close> */}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            The card below will be shown to your customers as a message from
            you. Let’s make it sound irresistable!
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <Pressable style={styles.addVideoCntnr}>
            <Text style={styles.addVideoTxt}>Add a Video or Image</Text>
          </Pressable>
          <View style={styles.msgCntnr}>
            <RRTextInput
              numberOfLines={4}
              multiline={true}
              label="Message"
              value={requestMessage}
              onChangeText={(value: string) => setRequestMessage(value)}
            ></RRTextInput>
          </View>
        </View>
      </ScrollView>
      {isShowBtn == true ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            marginBottom: 16,
          }}
        >
          <RRButton title="Proceed" onPress={() => {}}></RRButton>
        </View>
      ) : null}
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginTop: 16,
    // marginBottom: 50,
    // height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "karla",
  },
  infoContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.Peach_Cream,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "karla",
  },
  mainContainer: {
    padding: 24,
    marginTop: 24,
    backgroundColor: colors.White,
    borderRadius: 16,
  },
  addVideoCntnr: {
    backgroundColor: colors.Dove_Grey,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  addVideoTxt: {
    fontFamily: "karla",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
  msgCntnr: {
    marginTop: 24,
  },
});
