import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import { BACKEND_URL } from "constants/apiUrls";

const apiClient = axios.create({
  // baseURL: `${process.env.API_URL}`,
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    // const authToken = "";
    try {
      const authToken = await AsyncStorage.getItem("@token");
      if (authToken) config.headers.Authorization = "Bearer " + authToken;
    } catch (e) {
      console.log(e);
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  function (error) {
    // console.log(error);
    // console.log(error.response);
    if (error.response?.status === 401) {
      EventEmitter.emit("LOGOUT_USER");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default apiClient;
