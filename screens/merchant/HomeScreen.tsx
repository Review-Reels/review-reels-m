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
} from "react-native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "context/AuthContext";
import { set, SET_TOKEN } from "context/authActions";
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
  const isFocused = useIsFocused();

  React.useEffect(() => {
    getReviewResponse().then((res) => {
      if (res.data.length) {
        setReviewResponseList(res.data);
        setSearchedReviewResponseList(res.data);
      }
    });
  }, [isFocused]);

  React.useEffect(() => {
    getReviewRequest().then((res) => {
      if (res.data.length) {
        setAskMessageCreated(true);
      } else setAskMessageCreated(false);
    });
  }, []);

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
  return (
    <RRAppWrapper>
      {isAskMessageCreated == true ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}> Inbox</Text>
            {Platform.OS == "web" ? (
              <img src={ThreeDot}></img>
            ) : (
              <ThreeDot style={styles.threeDot}></ThreeDot>
            )}
          </View>
          {reviewResponseList.length > 0 ? (
            <View>
              <RRTextInput
                placeholder="Search .."
                onChangeText={searchReviewResponse}
              ></RRTextInput>
              <FlatList
                data={searchedReviewResponseList}
                renderItem={({ item, index }) => (
                  <Pressable onPress={() => goToReviewResponse(item)}>
                    <View style={styles.inboxContainer}>
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
                        <Text
                          style={{
                            marginBottom: 5,
                            color: item.isRead ? colors.Black2 : colors.Black,
                          }}
                        >
                          Asked via Email - {getElapsedTime(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>
          ) : (
            <NoReview></NoReview>
          )}
          <View style={styles.askBtn}>
            <RRButton
              title="Ask for Review"
              onPress={() => navigation.push("ReviewRequest")}
            ></RRButton>
          </View>
          {/* <Button
          title="Share Request"
          onPress={() => navigation.push("ShareRequest")}
        ></Button>
        <Button
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.removeItem("@token");
            authDispatch(set(SET_TOKEN, ""));
          }}
        ></Button> */}
        </View>
      ) : isAskMessageCreated == false ? (
        <NoAskMessage navigation={navigation}></NoAskMessage>
      ) : (
        <View>
          <Text>Loaading</Text>
        </View>
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
    fontFamily: "karla",
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
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.Dove_Grey,
    padding: 10,
  },
  customerName: { marginBottom: 5 },
  threeDot: { width: 10, height: 10 },
  askBtn: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
  },
});
