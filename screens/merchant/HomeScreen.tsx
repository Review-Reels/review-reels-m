import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authContext} from "context/AuthContext"
import {set, SET_TOKEN} from "context/authActions"

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const {authState,authDispatch} = React.useContext(authContext)
  console.log(authState,"kl")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.title}>{authState.user.name}</Text>
      <Button
        title="Review 1"
        onPress={() => navigation.push("ReviewDetails", { id: 1 })}
      ></Button>
      <Button
        title="Review 2"
        onPress={() => navigation.push("ReviewDetails", { id: 2 })}
      ></Button>
      <Button
        title="Review 3"
        onPress={() => navigation.push("ReviewDetails", { id: 3 })}
      ></Button>
      <Button
        title="Ask for Review"
        onPress={() => navigation.push("ReviewRequest")}
      ></Button>
       <Button
        title="Sign Out"
        onPress={async() =>{await AsyncStorage.removeItem("@token");authDispatch(set(SET_TOKEN,''))}}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
