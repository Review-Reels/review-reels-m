import { StackScreenProps } from "@react-navigation/stack";
import { RRTextInput } from "components";
import RRButton from "components/RRButton";
import { Actionsheet } from "native-base";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "react-native-btr";

export default function CustomerEmailInfo({
  visible,
  onPressClose,
  onPressProceed,
}: {
  visible: boolean;
  onPressClose: any;
  onPressProceed: any;
}) {
  const [customerName, setCustomerName] = React.useState("");
  const [customerNameError, setCustomerNameError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const onPressDone = () => {};

  const onPressAddNext = () => {
    if (!customerName) {
      setCustomerNameError("Required");
    }
    if (!email) {
      setEmailError("Required");
    }
    if (customerName && email) {
      setCustomerNameError("");
      if (validateEmail(email)) {
        setEmailError("");
        onPressProceed({ customerName, email });
        setCustomerName("");
        setEmail("");
      } else {
        setEmailError("Enter valid email.");
      }
    }
  };

  return (
    <View>
      {visible && (
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <View style={styles.container}>
            <Text style={styles.headerTxt}>Details of Customer</Text>
            <RRTextInput
              style={styles.mt_24}
              onChangeText={(val: string) => setCustomerName(val)}
              value={customerName}
              label="CUSTOMER NAME"
              placeholder="eg: Brandon Philip"
              error={customerNameError}
            ></RRTextInput>
            <RRTextInput
              style={styles.mt_24}
              onChangeText={(val: string) => setEmail(val)}
              value={email}
              label="EMAIL"
              placeholder="eg: brandon@gmail.com"
              error={emailError}
            ></RRTextInput>
            <View style={styles.actions}>
              <RRButton
                onPress={() => {
                  onPressClose();
                }}
                title="Close"
                mode="cancel"
                style={{ flex: 1 }}
              ></RRButton>
              <RRButton
                onPress={() => onPressAddNext()}
                title="Add Next"
                style={{ flex: 1, marginLeft: 8 }}
              ></RRButton>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 9999,
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
