import { StackScreenProps } from "@react-navigation/stack";
import { RRAppWrapper, RRTextInput } from "components";
import { S3_URL } from "constants/apiUrls";
import * as React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Close from "assets/svg/Close.svg";
import ClosePlain from "assets/svg/ClosePlain.svg";
import { RootStackParamList } from "types";
import colors from "constants/Colors";
import { authContext } from "context/AuthContext";
import { LOGOUT_USER, set, SET_LOADER, SET_TOKEN } from "context/authActions";
import { useToast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MailComposer from 'expo-mail-composer';

export type recepientType = {
  customerName: string;
  email: string;
};

export default function ProfileScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [requestMessage, setRequestMessage] = React.useState(
    "Hope you enjoyed using our product. It will be great if you can tell us how much you like our product with a short video."
  );
  const [image, setImage] = React.useState(null);
  const { authState, authDispatch } = React.useContext(authContext);
  const toast = useToast();

  React.useEffect(() => {
    if (route.params) {
      setRequestId(route.params.id);
      setRequestMessage(route.params.askMessage);
      setImage(route.params.imageUrl);
    }
  }, [route]);

  const onPressSubscription = () => {
    navigation.push("Subscription");
  };

  const onPressLogout = async () => {
    if (Platform.OS == "web") {
      await AsyncStorage.removeItem("@token");
      authDispatch(set(SET_TOKEN, ""));
    } else {
      authDispatch(set(LOGOUT_USER));
    }
  };

  const onPressEmail=()=>{
    MailComposer.composeAsync({recipients:['admin@reviewreels.app']})
  }

  return (
    <RRAppWrapper>
      <View style={styles.container}>
        <Pressable
          style={{ alignSelf: "flex-end" }}
          onPress={() => navigation.goBack()}
        >
          {Platform.OS == "web" ? (
            <img style={{ width: 48, height: 48 }} src={Close}></img>
          ) : (
            <Close width={48} height={48}></Close>
          )}
        </Pressable>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* <Text style={styles.title1}>@starkindustries</Text>
          <Text style={styles.title2}>Stark Industries</Text> */}
          <View style={styles.actionsContainer}>
            <Pressable onPress={onPressLogout}>
              <Text style={styles.actionItem}>Sign out</Text>
            </Pressable>
          </View>
          <View style={styles.appInfoCntnr}>
            <Text style={styles.appInfoTxt}>© Review Reels 2021 - V1.0.12</Text>
            <Pressable onPress={onPressEmail}><Text style={styles.appInfoTxt}>Support : <Text style={{color:colors.Alizarin_Crimson}}>admin@reviewreels.app</Text></Text></Pressable>
          </View>
        </View>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  title1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    fontFamily: "Karla",
    color: colors.Black5,
  },
  title2: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Karla",
    fontWeight: "400",
    color: colors.Black5,
    marginTop: 4,
  },
  actionsContainer: {
    backgroundColor: colors.Peach_Cream,
    borderRadius: 16,
    marginTop: 24,
  },
  actionItem: {
    padding: 24,
    borderBottomColor: colors.Black7,
    borderBottomWidth: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
    color: colors.Black2,
  },
  appInfoCntnr: {
    marginTop: 24,
    alignItems: "center",
  },
  appInfoTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Karla",
    fontWeight: "400",
    color: colors.Black2,
    textAlign: "center",
  },
});
