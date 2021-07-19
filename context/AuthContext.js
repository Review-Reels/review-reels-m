import React, { createContext, useReducer } from "react";
import { produce } from "immer";
import { SET_USER, SET_TOKEN } from "./authActions";

const InitialState = {
  user: {},
  token: "",
};

const authReducer = produce((draft, { type, payload }) => {
  switch (type) {
    case SET_USER:
      draft.user = payload;
      break;
    case SET_TOKEN:
      draft.token = payload;
      break;
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
