import { RRAppWrapper, RRCamera, RRTextInput } from "components";
import * as React from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "constants/colors";
import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import RRButton from "components/RRButton";
import Close from "assets/svg/Close.svg";
import AddPhoto from "assets/svg/AddPhoto.svg";
import { scaleSize } from "constants/layout";
import { Actionsheet, useDisclose } from "native-base";

export default function ReviewRequestScreen() {
  const [requestMessage, setRequestMessage] = useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [isShowBtn, setBtnStatus] = useState(true);
  const [isOpenCamera, setCameraStatus] = useState(false);
  const [isOpen, setOpenStatus] = useState(false);

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
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.headerCntnr}>
            <Text style={styles.title}>Create Your Ask Message</Text>
            <Pressable>
              {Platform.OS == "web" ? (
                <img style={{ width: 48, height: 48 }} src={Close}></img>
              ) : (
                <Close width={32} height={32}></Close>
              )}
            </Pressable>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              The card below will be shown to your customers as a message from
              you. Let’s make it sound irresistable!
            </Text>
          </View>
          <View style={styles.mainContainer}>
            <Pressable
              style={styles.addVideoCntnr}
              onPress={() => setOpenStatus(true)}
            >
              {Platform.OS == "web" ? (
                <img style={{ width: 32, height: 32 }} src={AddPhoto}></img>
              ) : (
                <AddPhoto width={32} height={32}></AddPhoto>
              )}
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
        <Actionsheet isOpen={isOpen} onClose={() => setOpenStatus(false)}>
          <Actionsheet.Content>
            <Actionsheet.Item>Choose from Gallery</Actionsheet.Item>
            <Actionsheet.Item
              onPressIn={() => {
                console.log("cooooool");
                setCameraStatus(true);
                setOpenStatus(false);
              }}
            >
              Capture Video
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
        {isOpenCamera && (
          <RRCamera
            isOpen={isOpenCamera}
            onClose={() => setCameraStatus(false)}
            onCapture={() => setCameraStatus(false)}
          ></RRCamera>
        )}
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  headerCntnr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "karla",
    flexWrap: "wrap",
    width: scaleSize(200),
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
    marginTop: 8,
  },
  msgCntnr: {
    marginTop: 24,
  },
});
