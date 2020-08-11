import React, { createContext, Component } from "react";

export const NotificationContext = createContext();

class NotificationContextProvider extends Component {
  state = {
    notificationCount: 0,
    isDarkMode: false,
    light: {
      APPBACKGROUNDCOLOR: "white",
      APPTEXTBLUE: "#003f5c", // blue color, this color looks like black for most text so think about changing it
      APPTEXTRED: "#fb5b5a", // pink/redish color, button color
      APPTEXTWHITE: "white", // white, color for some text
      APPINPUTVIEW: "white", // bluish color for text inputs  // "#465881"
      APPTEXTBLACK: "black",
      APPBUTTONPRESS: "#fb7b7a",
    },
    dark: {
      APPBACKGROUNDCOLOR: "black",
      APPTEXTBLUE: "#fb5b5a", // blue color, this color looks like black for most text so think about changing it
      APPTEXTRED: "#6a799a", // pink/redish color, button color
      APPTEXTWHITE: "white", // white, color for some text
      APPINPUTVIEW: "white", // bluish color for text inputs
      APPTEXTBLACK: "white",
      APPBUTTONPRESS: "#465881",
    },
  };

  setNotificationCount = (num) => {
    this.setState({ notificationCount: num });
  };

  toggleTheme = () => {
    this.setState({ isDarkMode: !this.state.isDarkMode });
  };

  render() {
    return (
      <NotificationContext.Provider
        value={{
          ...this.state,
          setNotificationCount: this.setNotificationCount,
          toggleTheme: this.toggleTheme,
        }}
      >
        {this.props.children}
      </NotificationContext.Provider>
    );
  }
}

export default NotificationContextProvider;
