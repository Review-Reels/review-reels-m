import { Dimensions, PixelRatio } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const guidelineBaseWidth = 375;
console.log(width);
export const scaleSize = (size: number) => (width / guidelineBaseWidth) * size;

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  deviceWidth: width,
};
