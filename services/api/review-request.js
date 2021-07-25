import axios from "./index";

export const reviewRequest = async (payload) => {
  return axios.post("review/reviewRequest", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateReviewRequestApi = async (payload, id) => {
  return axios.put(`review/reviewRequest/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReviewRequestWithUsername = async (username) => {
  return axios.get(`review/reviewRequest/${username}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getReviewRequest = async () => {
  return axios.get(`review/reviewRequest`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const submitReview = async (payload) => {
  return axios.post("review/reviewResponse", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
