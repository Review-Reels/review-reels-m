/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Login: "login",
      ReviewRequest: "create-review",
      ShareRequest: "share-review",
      Home: "home",
      ReviewDetails: "review",
      ReviewResponseDetails: "review-response",
      NotFound: "*",
      ViewRequest: ":username/:reviewResponseId",
      SubmitSuccess: "success",
      PublishReview: "publish-review",
    },
  },
};
