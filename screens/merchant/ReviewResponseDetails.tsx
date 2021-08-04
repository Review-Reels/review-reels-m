import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";
import ThreeDotVertical from "assets/svg/ThreeDotVertical.svg";
import Back from "assets/svg/Back.svg";

import { RRAppWrapper } from "components";
import colors from "constants/Colors";
import { getElapsedTime } from "utils/daysJsUtils";
import { scaleSize } from "constants/Layout";
import PlayButton from "assets/svg/PlayButton.svg";

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
              // <Video
              //   source={{
              //     uri: S3_URL + reviewResponse.videoUrl,
              //   }}
              //   style={styles.rounded}
              //   rate={1.0}
              //   isMuted={false}
              //   resizeMode="cover"
              //   volume={0.5}
              //   isLooping
              //   shouldPlay
              // />
              <View style={styles.overlay}>
                <Image
                  style={styles.rounded}
                  source={{ uri: S3_URL + reviewResponse?.imageUrl }}
                />
                {Platform.OS == "web" ? (
                  <img
                    src={PlayButton}
                    style={{ position: "absolute", top: "50%", left: "40%" }}
                  />
                ) : (
                  <PlayButton
                    style={{ position: "absolute", top: "50%", left: "40%" }}
                  ></PlayButton>
                )}
              </View>
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
    width: scaleSize(240),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 2,
    height: 450,
  },
  overlay: {
    width: scaleSize(240),
    height: 450,
    marginBottom: 8,
  },
});
