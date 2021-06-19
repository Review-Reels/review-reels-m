/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StyleProp } from "react-native";
import React from "react";
import { SvgProps } from "react-native-svg";

export type RootStackParamList = {
  NotFound: undefined;
  Login: undefined;
  ReviewRequest: undefined;
  ReviewDetails: { id: number };
  Home: undefined;
  ShareRequest: undefined;
};

export type TextInputType = {
  placeholder: string;
  value: string | undefined;
  error: string;
  style: StyleProp<any>;
  label: string;
  onChangeText: Function;
  onSubmitEditing: undefined;
  inputType: string;
  disabled: boolean;
};
