import { SignupPayload } from "types";
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
};
