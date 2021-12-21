import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import colors from "constants/Colors";

class CustomCountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDate: dayjs().second(30),
      secs: 30,
    };
  }

  componentDidMount() {
    this.updateTimer();
  }

  componentWillUnmount() {
    if (this.startTimer) {
      clearInterval(this.startTimer);
    }
  }

  clearTimer() {
    if (this.startTimer) {
      clearInterval(this.startTimer);
    }
  }

  updateTimer = () => {
    this.startTimer = setInterval(() => {
      let { eventDate } = this.state;

      if (eventDate <= 0) {
        clearInterval(this.startTimer);
        if (this.props.onFinished) {
          this.props.onFinished();
        }
      } else {
        eventDate = eventDate.subtract(1, "s");
        const secs = eventDate.second();
        console.log(secs);
        this.setState({
          secs,
          eventDate,
        });
      }
    }, 1000);
  };

  /** function to convert time to two digit time**/
  pad(num) {
    return ("0" + num).slice(-2);
  }

  render() {
    const { secs } = this.state;
    let cnvrtedSecs = this.pad(secs);
    return (
      <View style={styles.container}>
        <Text style={styles.timerText}>{`00 : ${cnvrtedSecs}`}</Text>
      </View>
    );
  }
}

export default CustomCountDown;

const styles = StyleSheet.create({
  timerText: {
    color: colors.White,
    backgroundColor: colors.Black2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "center",
    position: "absolute",
    zIndex: 5,
    top: 24,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Karla-Bold",
    lineHeight: 24,
    borderRadius: 8,
    elevation: 10,
  },
  container: {
    flex: 1,
    position: "absolute",
    zIndex: 99,
    alignSelf: "center",
  },
});
