import axios from "./index";

export const getReviewResponse = async () => {
  return axios.get(`review/reviewResponse`);
};

export const updateReviewResponse = async (payload, reviewResponseId) => {
  return axios.put(`review/reviewResponse/${reviewResponseId}`, payload);
};
