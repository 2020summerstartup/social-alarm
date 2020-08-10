import React, { Component, useContext, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    isDarkMode: false,
  };

  toggleTheme = () => {
    this.setState({ isDarkMode: !this.state.isDarkMode });
  };

  render() {
    return (
      <ThemeContext.Provider
        //value={{ ...this.state, toggleTheme: this.toggleTheme }}
        value={this.state.isDarkMode}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
