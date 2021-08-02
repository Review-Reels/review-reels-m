import * as React from "react";
import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";
import ThreeDotVertical from "assets/svg/ThreeDotVertical.svg";
import Back from "assets/svg/Back.svg";

import { RRAppWrapper } from "components";
import colors from "constants/colors";
import { getElapsedTime } from "utils/daysJsUtils";
import { scaleSize } from "constants/layout";

export default function ReviewResponseDetails({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewResponse, setReviewResponse] = React.useState({});
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  React.useEffect(() => {
    setReviewResponse(route.params);
  }, [route]);

  return (
    <RRAppWrapper>
      <View>
        <View style={styles.header}>
          <View style={styles.nameAndBack}>
            {Platform.OS !== "web" && (
              <Pressable onPress={() => navigation.goBack()}>
                <Back style={styles.back}></Back>
              </Pressable>
            )}
            <Text style={styles.title}> {reviewResponse?.customerName}</Text>
          </View>
          {Platform.OS == "web" ? (
            <img style={{ width: 10, height: 10 }} src={ThreeDotVertical}></img>
          ) : (
            <ThreeDotVertical style={styles.threeDot}></ThreeDotVertical>
          )}
        </View>
        <View style={styles.container}>
          <Pressable
            onPress={() =>
              navigation.navigate("PublishReview", {
                videoUrl: S3_URL + reviewResponse.videoUrl,
              })
            }
          >
            {reviewResponse.videoUrl && (
              <Video
                source={{
                  uri: S3_URL + reviewResponse.videoUrl,
                }}
                style={styles.rounded}
                rate={1.0}
                isMuted={false}
                resizeMode="cover"
                volume={0.5}
                isLooping
                shouldPlay
              />
            )}
          </Pressable>
          <Text>{getElapsedTime(reviewResponse.createdAt)}</Text>
        </View>
      </View>
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
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

  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.Dove_Grey,
    paddingBottom: 20,
    marginBottom: 20,
  },
  threeDot: {
    width: 10,
    height: 10,
  },
  nameAndBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    marginRight: 16,
  },
  rounded: {
    width: scaleSize(279),
    aspectRatio: 9 / 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 2,
  },
});
