import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { NativeBaseProvider } from "native-base";

import AuthContextProvider from "./context/AuthContext"

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider>
          <AuthContextProvider>
              <Navigation />
          </AuthContextProvider>
        </NativeBaseProvider>
        {/* <StatusBar /> */}
      </SafeAreaProvider>
    );
  }
}
