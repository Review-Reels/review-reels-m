import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { set, SET_TOKEN } from "context/authActions";
import { getReviewResponse } from "services/api/review-response";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
//added dayjs because its lighter than moment.js so the app  size will decrease

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const { authState, authDispatch } = React.useContext(authContext);
  const [reviewResponseList, setReviewResponseList] = React.useState([]);

  React.useEffect(() => {
    getReviewResponse().then((res) => {
      console.log(res.data);
      if (res.data.length) setReviewResponseList(res.data);
    });
  }, []);

  const goToReviewResponse = (item) => {
    console.log(item);
    navigation.navigate("ReviewResponseDetails", item);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.title}>{authState.user.name}</Text>
      <FlatList
        data={reviewResponseList}
        renderItem={({ item }) => (
          <Pressable onPress={() => goToReviewResponse(item)}>
            <Text style={styles.title}>{item.customerName}</Text>
            <Text>{item.whatYouDo}</Text>
            <Text>{dayjs().to(dayjs(item.createdAt))}</Text>
          </Pressable>
        )}
      />
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
        title="Share Request"
        onPress={() => navigation.push("ShareRequest")}
      ></Button>
      <Button
        title="Sign Out"
        onPress={async () => {
          await AsyncStorage.removeItem("@token");
          authDispatch(set(SET_TOKEN, ""));
        }}
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
