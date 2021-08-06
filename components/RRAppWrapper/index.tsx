import React, { ReactElement, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StyleProp,
  ActivityIndicator,
  View,
  Dimensions,
} from "react-native";
import Colors from "constants/Colors";
import { authContext } from "context/AuthContext";

export default function CSAppWrapper({
  style,
  children,
}: {
  style?: StyleProp<any>;
  children: ReactElement;
}) {
  const { authState, authDispatch } = useContext(authContext);
  return (
    <SafeAreaView style={[styles.container, style]}>
      {authState.isLoading && (
        <View style={styles.loaderCntnr}>
          <ActivityIndicator size="large" color={Colors.Alizarin_Crimson} />
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Athens_Gray,
  },
  loaderCntnr: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    zIndex: 999,
    backgroundColor: Colors.White2,
  },
});
