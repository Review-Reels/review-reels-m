import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { LOGOUT_USER, set, SET_LOADER, SET_TOKEN } from "context/authActions";

import ThreeDot from "assets/svg/ThreeDot.svg";
import { RRAppWrapper, RRTextInput } from "components";

import colors from "constants/Colors";

import { getElapsedTime } from "utils/daysJsUtils";
import RRButton from "components/RRButton";
import NoReview from "screens/shared/no-review";

import NoAskMessage from "screens/shared/no-ask-message";

import { S3_URL } from "constants/apiUrls";

import { LinearGradient } from "expo-linear-gradient";
// import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY, CLIENT_SECRET } from "constants/stripe";
// import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  // const { confirmPayment, loading } = useConfirmPayment();
  // const handlePay = async () => {
  //   console.log("clicked");
  //   const { error, paymentIntent } = await confirmPayment(CLIENT_SECRET, {
  //     type: "Card",
  //     //   billingDetails: { name: "Hari" },
  //   });
  //   if (error) {
  //     console.log(error);
  //     Alert.alert(`Error code:${error.code}`, error.message);
  //   } else if (paymentIntent) {
  //     Alert.alert("Success", `Payment Successfull ${paymentIntent.id}`);
  //   }
  // };
  return (
    <RRAppWrapper>
      {/* <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={{
            width: "100%",
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={(cardDetails) => {
            console.log("cardDetails", cardDetails);
          }}
          onFocus={(focusedField) => {
            console.log("focusField", focusedField);
          }}
        />
        <RRButton
          onPress={handlePay}
          title="Pay"
          isDisabled={loading}
        ></RRButton>
      </StripeProvider> */}
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: colors.White,
  },
});
