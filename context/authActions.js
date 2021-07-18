export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";

//action
export const set = (type, payload = null) => {
  return {
    type,
    payload,
  };
};
