import React from "react";
import { Animated, Easing, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

export default class TouchablePulse extends React.PureComponent {
  render() {
    const {
      children,
      scaleToValue,
      pressInDuration,
      pressOutDuration,
      pressInEasing,
      pressOutEasing,
      addedAnimationStyles,
      pressInCallback,
      pressOutCallback,
      onPressIn,
      onPressOut,
      disablePress,
      style,
      delayPressIn,
      delayPressOut,
      onLongPress,
      onPress,
    } = this.props;
    // initialize animation
    const animatedValue = new Animated.Value(0);
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, scaleToValue],
    });

    const animationStyle = {
      transform: [{ scale }],
    };
    const onPressInFunction = () => {
      if (disablePress) return;
      if (onPressIn) {
        onPressIn();
      }
      animatedValue.setValue(0); // set initial value to zero on press down
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: pressInDuration,
        easing: pressInEasing,
        useNativeDriver: true,
      }).start(pressInCallback);
    };
    const onPressOutFunction = () => {
      if (onPressOut) {
        onPressOut();
      }
      if (disablePress) return;
      // don't set the intial value. rather, take what it is now and animate from there
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: pressOutDuration,
        easing: pressOutEasing,
        useNativeDriver: true,
      }).start(pressOutCallback);
    };
    const onLongPressFunction = () => {
      if (!onLongPress) return null;
      onLongPress();
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: pressOutDuration,
        easing: pressOutEasing,
        useNativeDriver: true,
      }).start(pressOutCallback);
    };
    const onPressFunction = () => {
      if (!onPress) return null;
      onPress();
    };

    return (
      <TouchableWithoutFeedback
        onPressIn={onPressInFunction}
        onPressOut={onPressOutFunction}
        onLongPress={onLongPressFunction}
        onPress={onPressFunction}
        style={{ backgroundColor: "transparent" }}
      >
        <Animated.View style={[style, animationStyle, addedAnimationStyles]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

TouchablePulse.defaultProps = {
  pressInDuration: 150,
  pressOutDuration: 150,
  pressInEasing: Easing.out(Easing.quad),
  pressOutEasing: Easing.out(Easing.quad),
  scaleToValue: 0.92,
  disablePress: false,
  delayPressIn: 0,
  delayPressOut: 0,
  style: {},
};

TouchablePulse.propType = {
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  pressOutCallback: PropTypes.func,
  pressInCallback: PropTypes.func,
  addedAnimationStyles: PropTypes.object,
  // style: PropTypes.object,
  scaleToValue: PropTypes.number,
  pressInDuration: PropTypes.number,
  pressOutDuration: PropTypes.number,
  disablePress: PropTypes.bool,
  // style: PropTypes.object,
  delayPressIn: PropTypes.number,
  delayPressOut: PropTypes.number,
  onLongPress: PropTypes.func,
};
