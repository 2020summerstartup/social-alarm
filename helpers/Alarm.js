/**
 * Alarm
 * id {string} int for push notification
 * active {boolean}
 * message {string} Alarm message
 */

// libs
// import { Platform } from "react-native";
import PropTypes from "prop-types";

// const emptyProperty = Platform.select({ ios: "", android: null });

export class Alarm {
  constructor({
    id = "",
    active = false,
    title = "Alarm",
  }) {
    this.id = id;
    this.active = active;
    this.title = title;
  }
}

Alarm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.boolean,
  title: PropTypes.string,
};

export default Alarm;
