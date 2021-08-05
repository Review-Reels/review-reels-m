import * as React from "react";
import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";

import { RRAppWrapper } from "components";

import { scaleSize } from "constants/Layout";
import colors from "constants/Colors";

export default function PublishReview({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewResponse, setReviewResponse] = React.useState({});
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  React.useEffect(() => {
    console.log(route.params);
    setReviewResponse(route.params);
  }, [route]);

  return (
    <RRAppWrapper>
      <View
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          backgroundColor: colors.Black,
        }}
      >
        {/* <View> */}
        {reviewResponse.videoUrl && (
          <Video
            source={{
              uri: reviewResponse.videoUrl,
            }}
            style={{
              width: scaleSize(375),
              aspectRatio: 9 / 16,
              borderRadius: 16,
            }}
            rate={1.0}
            isMuted={false}
            resizeMode="contain"
            volume={0.5}
            isLooping
            shouldPlay
          />
        )}
        <View style={styles.btnCntnr}>
          <Pressable style={styles.publishBtn}>
            <Text style={styles.btnTxt}>Publish Review</Text>
          </Pressable>
        </View>
      </View>
      {/* </View> */}
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  btnCntnr: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    justifyContent: "center",
  },
  publishBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.Peach_Cream,
    width: "100%",
    borderRadius: 64,
  },
  btnTxt: {
    fontFamily: "karla",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
});
