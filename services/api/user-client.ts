import {
  SignupPayload,
  googleSignUpPayload,
  updateUserPayload,
  signInPayload,
  signUpPayload,
} from "types";
import axios from "./index";

export default {
  signUp(payload: SignupPayload | undefined) {
    return axios.post("user/signup", payload);
  },
  getProfileInfo() {
    return axios.get("student/profile");
  },
  changePassword(payload: { email: string }) {
    return axios.post("faculty/user/change-password", payload);
  },
  googleSignIn(payload: googleSignUpPayload | undefined) {
    return axios.post("auth/google_sign_in", payload);
  },
  emailSignIn(payload: signInPayload | undefined) {
    return axios.post("auth/signin", payload);
  },
  emailSignUp(payload: signUpPayload | undefined) {
    return axios.post("auth/signup", payload);
  },
  updateUser(payload: updateUserPayload | undefined, auth: string) {
    const headers = {
      Authorization: "Bearer " + auth,
    };
    return axios.post("user/update_user", payload, { headers: headers });
  },
};
