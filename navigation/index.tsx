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
import ReviewDetailsScreen from "screens/merchant/ReviewDetailScreen";
import ReviewRequestScreen from "screens/merchant/ReviewRequestScreen";
import ShareRequestScreen from "screens/merchant/ShareRequestScreen";
import HomeScreen from "screens/merchant/HomeScreen";
import { RootStackParamList } from "types";
import LinkingConfiguration from "./LinkingConfiguration";
import ViewRequestScreen from "screens/customer/ViewRequestScreen";
import SubmitSuccessScreen from "screens/customer/SubmitSuccessScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { useState ,useContext} from "react";
import {authContext} from "../context/AuthContext"
import {set, SET_TOKEN, SET_USER} from "context/authActions"

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

  const {authState,authDispatch} = useContext(authContext)

  React.useEffect(()=>{
   checkLogin()
  },[])

  const checkLogin = async () =>{
    const authToken =  await AsyncStorage.getItem("@token");

    if(authToken){
    const decodedToken = jwt_decode<JwtPayload>(authToken) 
    let currentDate = new Date();
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      await AsyncStorage.removeItem("@token")
      } else{
        authDispatch(set(SET_TOKEN,authToken))
      }
    }
    const user =  await AsyncStorage.getItem("@user");
    if(user)
    authDispatch(set(SET_USER,JSON.parse(user)))
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!authState.token?  <Stack.Screen name="Login" component={LoginScreen} />:
       (<><Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="ReviewRequest" component={ReviewRequestScreen} />
       <Stack.Screen name="ReviewDetails" component={ReviewDetailsScreen} />
       <Stack.Screen name="ShareRequest" component={ShareRequestScreen} />
       <Stack.Screen
         name="NotFound"
         component={NotFoundScreen}
         options={{ title: "Oops!" }}
       />
       <Stack.Screen name="ViewRequest" component={ViewRequestScreen} />
       <Stack.Screen name="SubmitSuccess" component={SubmitSuccessScreen} /></>)
       }
     
    </Stack.Navigator>
  );
}
