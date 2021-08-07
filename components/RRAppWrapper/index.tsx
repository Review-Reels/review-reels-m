import React, { ReactElement, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StyleProp,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  StatusBar,
} from "react-native";
import Colors from "constants/Colors";
import { authContext } from "context/AuthContext";

export default function CSAppWrapper({
  style,
  children,
  backgroundColor,
}: {
  style?: StyleProp<any>;
  children: ReactElement;
  backgroundColor: string;
}) {
  const { authState, authDispatch } = useContext(authContext);
  return (
    <SafeAreaView
      style={[
        styles.container,
        style,
        {
          backgroundColor: backgroundColor ? backgroundColor : Colors.White,
        },
      ]}
    >
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor ? backgroundColor : Colors.White}
        barStyle={"dark-content"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {authState.isLoading && (
          <View style={styles.loaderCntnr}>
            <ActivityIndicator size="large" color={Colors.Alizarin_Crimson} />
          </View>
        )}

        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
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
