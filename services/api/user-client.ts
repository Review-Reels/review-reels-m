import axios from "./index";

export default {
  login(payload: { username: string; password: string }) {
    return axios.post("student/auth/login", payload);
  },
  getProfileInfo() {
    return axios.get("student/profile");
  },
  changePassword(payload: { email: string }) {
    return axios.post("faculty/user/change-password", payload);
  },
};
