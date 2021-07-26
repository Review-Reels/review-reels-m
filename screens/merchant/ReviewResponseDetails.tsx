import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";

export default function ReviewResponseDetails({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewResponse, setReviewResponse] = React.useState({});
  const [status, setStatus] = React.useState({});
  React.useEffect(() => {
    setReviewResponse(route.params);
  }, [route]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Response Details</Text>
      <Text>{reviewResponse?.customerName}</Text>
      <Text>{reviewResponse?.whatYouDo}</Text>
      <Video
        // ref={video}
        source={{
          uri: S3_URL + reviewResponse?.videoUrl,
        }}
        rate={1.0}
        isMuted={false}
        resizeMode="cover"
        volume={0.5}
        isLooping
        shouldPlay
      />
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
