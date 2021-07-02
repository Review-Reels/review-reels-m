import axios from "axios";
import { API_URL } from "@env";
// import {getAuthToken} from '_utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Snackbar from 'react-native-snackbar';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    const authToken = "";
    // const authToken = await AsyncStorage.getItem('@auth_token');
    config.headers.Authorization = "Bearer " + authToken;
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
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default apiClient;
