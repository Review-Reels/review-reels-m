/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import LoginScreen from "screens/merchant/LoginScreen";
import NotFoundScreen from "screens/merchant/NotFoundScreen";
// import ReviewDetailsScreen from "screens/merchant/ReviewDetailScreen";
import ReviewRequestScreen from "screens/merchant/ReviewRequestScreen";
import ShareRequestScreen from "screens/merchant/ShareRequestScreen";
import HomeScreen from "screens/merchant/HomeScreen";
import { RootStackParamList } from "types";
import LinkingConfiguration from "./LinkingConfiguration";
import ViewRequestScreen from "screens/customer/ViewRequestScreen";
import SubmitSuccessScreen from "screens/customer/SubmitSuccessScreen";
import ReviewResponseDetails from "screens/merchant/ReviewResponseDetails";
import PublishReview from "screens/merchant/PublishReview";
import SubscriptionScreen from "screens/merchant/SubscriptionScreen";
import EmailSignInScreen from "screens/merchant/EmailSignInScreen";
import EmailSignUpScreen from "screens/merchant/EmailSignUpScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useState, useContext } from "react";
import { authContext } from "../context/AuthContext";
import { set, SET_TOKEN, SET_USER } from "context/authActions";
import LoadingScreen from "screens/merchant/LoadingScreen";
import SendEmails from "screens/merchant/SendEmails";
import ProfileScreen from "screens/merchant/ProfileScreen";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { authState, authDispatch } = useContext(authContext);
  const [isLoadNav, setLoadNav] = useState(false);

  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const authToken = await AsyncStorage.getItem("@token");
    if (authToken) {
      const decodedToken = jwt_decode<JwtPayload>(authToken);
      let currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await AsyncStorage.removeItem("@token");
      } else {
        authDispatch(set(SET_TOKEN, authToken));
      }
    }
    const user = await AsyncStorage.getItem("@user");
    if (user) authDispatch(set(SET_USER, JSON.parse(user)));
    setLoadNav(true);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoadNav && (
        <>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="ViewRequest" component={ViewRequestScreen} />
          <Stack.Screen name="SubmitSuccess" component={SubmitSuccessScreen} />
        </>
      )}
      {isLoadNav && !authState.token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
          <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
          <Stack.Screen name="ViewRequest" component={ViewRequestScreen} />
          <Stack.Screen name="SubmitSuccess" component={SubmitSuccessScreen} />
        </>
      ) : (
        isLoadNav && (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="ReviewRequest"
              component={ReviewRequestScreen}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            ></Stack.Screen>
            <Stack.Screen name="ShareRequest" component={ShareRequestScreen} />
            <Stack.Screen name="SendEmails" component={SendEmails} />
            <Stack.Screen name="ViewRequest" component={ViewRequestScreen} />
            <Stack.Screen
              name="SubmitSuccess"
              component={SubmitSuccessScreen}
            />
            <Stack.Screen
              name="ReviewResponseDetails"
              component={ReviewResponseDetails}
            />
            <Stack.Screen name="PublishReview" component={PublishReview} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />

            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: "Oops!" }}
            />
          </>
        )
      )}
    </Stack.Navigator>
  );
}
