import React, { ReactElement, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StyleProp,
  ActivityIndicator,
  View,
} from "react-native";
import Loader from "react-native-modal-loader";
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    zIndex: 999,
    backgroundColor: Colors.White2,
  },
});
