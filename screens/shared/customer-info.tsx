import { StackScreenProps } from "@react-navigation/stack";
import { RRTextInput } from "components";
import RRButton from "components/RRButton";
import { Actionsheet } from "native-base";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "react-native-btr";

export default function CustomerInfo({
  visible,
  onPressClose,
  onPressProceed,
}: {
  visible: boolean;
  onPressClose: any;
  onPressProceed: any;
}) {
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [job, setJob] = React.useState("");

  const sendReview = () => {
    if (name) onPressProceed({ name, job });
    else setNameError("Your name cannot be blank");
  };
  return (
    <Actionsheet isOpen={visible} onClose={onPressClose}>
      <Actionsheet.Content style={styles.container}>
        <View style={{ width: "100%" }}>
          <Text style={styles.headerTxt}>A little about you</Text>
          <RRTextInput
            style={styles.mt_24}
            onChangeText={(val: string) => {
              setName(val);
              setNameError("");
            }}
            value={name}
            label="YOUR NAME?"
            placeholder="eg: Nick Fury"
            error={nameError}
          ></RRTextInput>
          <RRTextInput
            style={styles.mt_24}
            onChangeText={(val: string) => setJob(val)}
            value={job}
            label="WHAT YOU DO? (OPTIONAL)"
            placeholder="eg: Founder of Avengers"
          ></RRTextInput>
          <View style={styles.mt_24}>
            <RRButton onPress={sendReview} title="Send Review"></RRButton>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  mt_24: {
    marginTop: 24,
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Karla-Bold",
    lineHeight: 32,
  },
});
