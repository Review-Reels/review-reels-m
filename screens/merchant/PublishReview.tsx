import * as React from "react";
import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { S3_URL } from "constants/apiUrls";
import { Video } from "expo-av";
import Close from "assets/svg/Close.svg";
import Instagram from "assets/svg/Instagram.svg";
import { RRAppWrapper } from "components";
import { scaleSize } from "constants/Layout";
import colors from "constants/Colors";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { authContext } from "context/AuthContext";
import { set, SET_LOADER } from "context/authActions";

export default function PublishReview({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [reviewResponse, setReviewResponse] = React.useState({});
  const [isShowPublish, setShowPublish] = React.useState(false);
  const video = React.useRef(null);
  const { authState, authDispatch } = React.useContext(authContext);

  React.useEffect(() => {
    console.log(route.params);
    setReviewResponse(route.params);
  }, [route]);

  const onPressDownload = () => {
    if (Platform.OS == "web") {
      window.open(reviewResponse?.videoUrl);
    } else authDispatch(set(SET_LOADER, true));
    FileSystem.downloadAsync(
      reviewResponse.videoUrl,
      FileSystem.documentDirectory +
        "ReviewReels-" +
        new Date().toISOString() +
        ".mp4"
    )
      .then(({ uri }) => {
        authDispatch(set(SET_LOADER, false));
        console.log("Finished downloading to ", uri);
        saveFile(uri);
      })
      .catch((error) => {
        authDispatch(set(SET_LOADER, false));
        console.error(error);
      });
  };

  const saveFile = async (fileUri: string) => {
    const shareResult = await Sharing.shareAsync(fileUri);
    // if (Platform.OS === "android") {
    //   const { status } = await MediaLibrary.requestPermissionsAsync();
    //   if (status === "granted") {
    //     try {
    //       const asset = await MediaLibrary.createAssetAsync(fileUri);
    //       const album = await MediaLibrary.getAlbumAsync("Download");
    //       if (album == null) {
    //         await MediaLibrary.createAlbumAsync("Download", asset, false);
    //       } else {
    //         await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    //       }
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // } else {
    // }
  };

  return (
    <RRAppWrapper>
      {isShowPublish === true ? (
        <View style={styles.container}>
          <View style={styles.headerCntnr}>
            <Text style={styles.title}>Publish Review</Text>
            <Pressable onPress={() => setShowPublish(false)}>
              {Platform.OS == "web" ? (
                <img style={{ width: 48, height: 48 }} src={Close}></img>
              ) : (
                <Close width={48} height={48}></Close>
              )}
            </Pressable>
          </View>
          <View style={[styles.card, { backgroundColor: colors.Sweet_Pink }]}>
            <View style={styles.cardRow1}>
              <View>
                <Text style={styles.cardTxt1}>DOWLOAD THE VIDEO</Text>
                <Text style={styles.cardTxt2}>
                  Share the downloaded video to your social media followers to improve the social proof.
                </Text>
              </View>
              {/* <View>
                {Platform.OS == "web" ? (
                  <img style={{ width: 40, height: 40 }} src={Instagram}></img>
                ) : (
                  <Instagram width={40} height={40}></Instagram>
                )}
              </View> */}
            </View>
            <View style={{ alignSelf: "flex-start" }}>
              <Pressable onPress={onPressDownload} style={styles.action}>
                <Text style={styles.actionTxt}>Download</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.previewCntnr}>
          {reviewResponse.videoUrl && (
            <Video
              source={{
                uri: reviewResponse.videoUrl,
              }}
              style={[Platform.OS!=='web'&&styles.rounded]}
              rate={1.0}
              isMuted={false}
              resizeMode="contain"
              volume={0.5}
              useNativeControls
            />
          )}
          <View style={styles.btnCntnr}>
            <Pressable
              onPress={() => setShowPublish(true)}
              style={styles.publishBtn}
            >
              <Text style={styles.btnTxt}>Publish Review</Text>
            </Pressable>
          </View>
        </View>
      )}
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Karla-Bold",
  },
  headerCntnr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewCntnr: {
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: colors.Black,
  },
  video: {
    width: scaleSize(375),
    aspectRatio: 9 / 16,
    borderRadius: 16,
  },
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
    fontFamily: "Karla-Bold",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    padding: 24,
    marginTop: 24,
    borderRadius: 12,
  },
  cardRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTxt1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    fontFamily: "Karla-Bold",
    color: colors.Black2,
  },
  cardTxt2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontFamily: "Karla",
    flexWrap: "wrap",
    maxWidth: scaleSize(200),
    marginTop: 8,
    marginBottom: 24,
    color: colors.Black2,
  },
  action: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.Black4,
    borderRadius: 24,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  actionTxt: {
    color: colors.White,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Karla-Bold",
  },
  rounded: {
    height: "80%",
    width: scaleSize(279),
    aspectRatio: 9 / 16,
    marginTop: 24,
    borderRadius: 16,
    alignSelf: "center",
  },
});
