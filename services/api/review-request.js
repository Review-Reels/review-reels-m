import axios from "./index";

export const reviewRequest = async (payload) => {
  return axios.post("review/reviewRequest", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReviewRequest = async (username) => {
  return axios.get(`review/reviewRequest/${username}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
