export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";
export const SET_LOADER = "SET_LOADER";
export const LOGOUT_USER = "LOGOUT_USER";

//action
export const set = (type, payload = null) => {
  return {
    type,
    payload,
  };
};
