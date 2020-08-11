import React, { createContext, Component } from "react";
// context - controlls "global state"
// used for theme (dark mode) and notification number
export const NotificationContext = createContext();

class NotificationContextProvider extends Component {
  state = {
    // number of notifications a user has
    notificationCount: 0,
    // if the app is in dark mode
    isDarkMode: false,
    // light mode colors
    light: {
      APPBACKGROUNDCOLOR: "white",
      APPTEXTBLUE: "#003f5c", // blue color, this color looks like black for most text so think about changing it
      APPTEXTRED: "#fb5b5a", // pink/redish color, button color
      APPTEXTWHITE: "white", // white, color for some text
      APPINPUTVIEW: "white", // bluish color for text inputs  // "#465881"
      APPTEXTBLACK: "black",
      APPBUTTONPRESS: "#465881",
    },
    // dark mode colors
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

  // changes number of notifications
  setNotificationCount = (num) => {
    this.setState({ notificationCount: num });
  };

  // changes theme (dark mode vs light mode)
  toggleTheme = () => {
    this.setState({ isDarkMode: !this.state.isDarkMode });
  };

  render() {
    return (
      // don't fully understand this, but tutorial where code came from
      // https://www.youtube.com/watch?v=6RhOzQciVwI&list=PL4cUxeGkcC9hNokByJilPg5g9m2APUePI
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
