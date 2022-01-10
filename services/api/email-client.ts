import { sendEmailPayload } from "types";
import axios from "./index";

export default {
  sendEmail(payload: sendEmailPayload) {
    return axios.post("email/sendMail", payload);
  },
  reSendMail(payload: sendEmailPayload) {
    return axios.post("email/reSendMail", payload);
  },
};
