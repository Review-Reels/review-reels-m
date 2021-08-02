import * as React from "react";
import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";

import { RRAppWrapper } from "components";

import { scaleSize } from "constants/layout";

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
      <View style={{ height: 300, width: 200, flex: 1 }}>
        {/* <View> */}
        {reviewResponse.videoUrl && (
          <Video
            source={{
              uri: reviewResponse.videoUrl,
            }}
            style={{
              width: scaleSize(375),
              aspectRatio: 9 / 16,
            }}
            rate={1.0}
            isMuted={false}
            resizeMode="contain"
            volume={0.5}
            isLooping
            shouldPlay
          />
        )}
      </View>
      {/* </View> */}
    </RRAppWrapper>
  );
}

// const styles = StyleSheet.create({
//   rounded: {
//     width: scaleSize(279),
//     aspectRatio: 9 / 16,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     borderBottomRightRadius: 16,
//     borderBottomLeftRadius: 2,
//   },
// });
