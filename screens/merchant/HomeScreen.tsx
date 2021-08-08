import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { LOGOUT_USER, set, SET_LOADER, SET_TOKEN } from "context/authActions";
import {
  getReviewResponse,
  updateReviewResponse,
} from "services/api/review-response";
import ThreeDot from "assets/svg/ThreeDot.svg";
import { RRAppWrapper, RRTextInput } from "components";

import colors from "constants/Colors";

import { getElapsedTime } from "utils/daysJsUtils";
import RRButton from "components/RRButton";
import NoReview from "screens/shared/no-review";
import { getReviewRequest } from "services/api/review-request";
import NoAskMessage from "screens/shared/no-ask-message";
import EventEmitter from "react-native-eventemitter";
import { S3_URL } from "constants/apiUrls";
import { backgroundColor } from "styled-system";

//added dayjs because its lighter than moment.js so the app  size will decrease
const colorList = [
  colors.Anakiwa,
  colors.Sweet_Pink,
  colors.Peach_Orange,
  colors.Azalea,
];
export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const { authState, authDispatch } = React.useContext(authContext);
  const [reviewResponseList, setReviewResponseList] = React.useState([]);
  const [searchedReviewResponseList, setSearchedReviewResponseList] =
    React.useState([]);
  const [isAskMessageCreated, setAskMessageCreated] = React.useState<
    boolean | null
  >(null);
  const [reviewRequest, setReviewRequest] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    getReviewResponses();
    getReviewRequests();
  }, [isFocused]);

  React.useEffect(() => {
    EventEmitter.on("LOGOUT_USER", () => {
      authDispatch(set(LOGOUT_USER));
    });
    return () => {
      EventEmitter.removeAllListeners("LOGOUT_USER");
    };
  }, []);

  const getReviewResponses = () => {
    setRefreshing(true);
    getReviewResponse()
      .then((res) => {
        authDispatch(set(SET_LOADER, false));
        if (res.data.length) {
          setReviewResponseList(res.data);
          setSearchedReviewResponseList(res.data);
        } else {
          setReviewResponseList([]);
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const getReviewRequests = () => {
    authDispatch(set(SET_LOADER, true));
    getReviewRequest()
      .then(
        (res) => {
          authDispatch(set(SET_LOADER, false));
          if (res.data.length) {
            setReviewRequest(res.data[0]);
            setAskMessageCreated(true);
          } else {
            setAskMessageCreated(false);
          }
        },
        (err) => {
          authDispatch(set(SET_LOADER, false));
        }
      )
      .catch((error) => authDispatch(set(SET_LOADER, true)));
  };

  const goToReviewResponse = (item) => {
    if (!item.isRead)
      updateReviewResponse({ isRead: true }, item.id)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    navigation.navigate("ReviewResponseDetails", item);
  };

  const searchReviewResponse = (value: string) => {
    const searchedList = reviewResponseList.filter((item) =>
      item.customerName.toLowerCase().includes(value.toLowerCase())
    );
    setSearchedReviewResponseList(searchedList);
  };

  const onRefresh = React.useCallback(() => {
    getReviewResponses();
    getReviewRequests();
  }, []);

  const onPressLogout = () => {
    authDispatch(set(LOGOUT_USER));
  };

  return (
    <RRAppWrapper>
      {isAskMessageCreated == true ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Inbox</Text>
            {Platform.OS == "web" ? (
              <Pressable
                onPress={async () => {
                  await AsyncStorage.removeItem("@token");
                  authDispatch(set(SET_TOKEN, ""));
                }}
              >
                <img src={ThreeDot}></img>
              </Pressable>
            ) : (
              <Pressable onPress={onPressLogout}>
                <ThreeDot style={styles.threeDot}></ThreeDot>
              </Pressable>
            )}
          </View>
          {reviewResponseList.length > 0 ? (
            <View>
              <RRTextInput
                placeholder="Search .."
                onChangeText={searchReviewResponse}
              ></RRTextInput>
              <FlatList
                style={{ height: "100%" }}
                ListFooterComponent={<View />}
                ListFooterComponentStyle={{ height: 200 }}
                data={searchedReviewResponseList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item, index }) => (
                  <Pressable onPress={() => goToReviewResponse(item)}>
                    <View style={styles.inboxContainer}>
                      <View style={styles.secondInboxCntr}>
                        <View
                          style={[
                            styles.rounded,
                            { backgroundColor: colorList[index % 4] },
                          ]}
                        >
                          <Text style={styles.textColor}>
                            {item.customerName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.nameFlex}>
                          <Text
                            style={{
                              marginBottom: 5,
                              color: item.isRead ? colors.Black2 : colors.Black,
                              fontWeight: item.isRead ? "normal" : "bold",
                            }}
                          >
                            {item.customerName}
                          </Text>
                          <View style={styles.textWrapper}>
                            <Text
                              style={{
                                color: item.isRead
                                  ? colors.Black2
                                  : colors.Black,
                              }}
                            >
                              Shared a video review
                            </Text>

                            <View
                              style={{
                                width: 4,
                                height: 4,
                                backgroundColor: colors.Black3,
                                borderRadius: "50%",
                                marginHorizontal: 8,
                                top: 8,
                              }}
                            ></View>

                            <Text
                              style={{
                                color: item.isRead
                                  ? colors.Black2
                                  : colors.Black,
                              }}
                            >
                              {getElapsedTime(item.createdAt)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {!item.isRead && (
                        <View>
                          <Image
                            style={{ height: 40, width: 32, borderRadius: 4 }}
                            source={{ uri: S3_URL + item.imageUrl }}
                          />
                        </View>
                      )}
                    </View>
                  </Pressable>
                )}
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ flex: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <NoReview></NoReview>
            </ScrollView>
          )}
          <View style={styles.askBtn}>
            <RRButton
              title="Ask for Review"
              onPress={() => navigation.push("ShareRequest")}
            ></RRButton>
          </View>
        </View>
      ) : isAskMessageCreated == false ? (
        <NoAskMessage navigation={navigation}></NoAskMessage>
      ) : (
        <View></View>
      )}
    </RRAppWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: colors.White,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Karla",
    lineHeight: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rounded: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textColor: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  nameFlex: {
    flexDirection: "column",
  },
  inboxContainer: {
    marginTop: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.Dove_Grey,
    padding: 10,
    justifyContent: "space-between",
  },
  secondInboxCntr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customerName: { marginBottom: 5 },
  threeDot: { width: 10, height: 10 },
  askBtn: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
  },
  textWrapper: {
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
