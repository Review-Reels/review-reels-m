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
      Home: "home",
      Login: "login",
      ReviewRequest: "create-review",
      ShareRequest: "share-review",
      ReviewDetails: "review",
      ReviewResponseDetails: "review-response",
      NotFound: "*",
      ViewRequest: "view/:username/:reviewResponseId?",
      SubmitSuccess: "success",
      PublishReview: "publish-review",
      SendEmails: "send-emails",
      EmailSignIn: "email-signin",
    },
  },
};
