import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";

export default function ReviewDetailScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewRequest, setReviewRequest] = React.useState({});
  React.useEffect(() => {
    setReviewRequest(route.params);
  }, [route]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Details</Text>
      <Text>{reviewRequest?.askMessage}</Text>
      <Text>{reviewRequest?.createdAt}</Text>
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
