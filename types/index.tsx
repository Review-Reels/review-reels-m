/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StyleProp } from "react-native";
import React from "react";

export type RootStackParamList = {
  NotFound: undefined;
  Login: undefined;
  ReviewRequest: undefined;
  ReviewDetails: { id: number };
  Home: undefined;
  ShareRequest: undefined;
  ViewRequest: { merchant: string };
};

export type TextInputProps = {
  placeholder?: string;
  value?: string | undefined;
  error?: string;
  style?: StyleProp<any>;
  label?: string;
  onChangeText: Function;
  onSubmitEditing?: undefined;
  disabled?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
};

export type ButtonProps = {
  title: string;
  onPress: Function;
  style?: StyleProp<any>;
  isDisabled?: boolean;
};

export type CameraProps = {
  isOpen: boolean;
  onClose: Function;
  onCapture: Function;
};

export type SignupPayload = {
  username: string;
  email: string;
  name: string;
  id?: string;
  givenName?: string;
  familyName?: string;
  photoUrl?: string;
  accessToken?: string;
  refreshToken?: string;
};