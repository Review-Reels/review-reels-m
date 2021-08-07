import React, { createContext, useReducer } from "react";
import { produce } from "immer";
import { SET_USER, SET_TOKEN, SET_LOADER, LOGOUT_USER } from "./authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InitialState = {
  user: {},
  token: "",
  isLoading: false,
};

const authReducer = produce((draft, { type, payload }) => {
  switch (type) {
    case SET_USER:
      draft.user = payload;
      break;
    case SET_TOKEN:
      draft.token = payload;
      break;
    case SET_LOADER:
      draft.isLoading = payload;
      break;
    case LOGOUT_USER:
      draft.token = "";
      draft.user = {};
      AsyncStorage.removeItem("@user");
      AsyncStorage.removeItem("@token");
    default:
      break;
  }
});

export const authContext = createContext(InitialState);

const AuthContextProvider = (props) => {
  const [authState, authDispatch] = useReducer(authReducer, InitialState);

  return (
    <authContext.Provider value={{ authState, authDispatch }}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
