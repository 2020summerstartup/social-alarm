import React, { createContext, Component } from "react";

import {db, auth} from "../firebase/firebase";

export const NotificationContext = createContext();

class NotificationContextProvider extends Component {
  state = {
    notificationCount: 20,
  };

  setNotificationCount = (num) => {
      this.setState({notificationCount: num})
  }


  render() {

    db.collection("users").doc("annadsinger@gmail.com").get().then((doc) => {
        this.setState({notificationCount: doc.data().alertQueue.length.toString()})
      })


    return (
      <NotificationContext.Provider value={{...this.state, setNotificationCount: this.setNotificationCount}}>
        {this.props.children}
      </NotificationContext.Provider>
    );
  }
}

export default NotificationContextProvider;
