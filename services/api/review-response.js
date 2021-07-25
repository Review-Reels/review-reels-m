import axios from "./index";

export const getReviewResponse = async () => {
  return axios.get(`review/reviewResponse`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
