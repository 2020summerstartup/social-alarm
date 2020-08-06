import React, { createContext, Component } from "react";

export const NotificationContext = createContext();

class NotificationContextProvider extends Component {
  state = {
    notificationCount: 20,
  };

  setNotificationCount = (num) => {
      this.setState({notificationCount: num})
  }


  render() {
    return (
      <NotificationContext.Provider value={{...this.state, setNotificationCount: this.setNotificationCount}}>
        {this.props.children}
      </NotificationContext.Provider>
    );
  }
}

export default NotificationContextProvider;
