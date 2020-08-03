import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ThemeContext = React.createContext(null);
const ThemeConstants = {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
  },
  dark: {
    backgroundColor: '#000',
    fontColor: '#fff',
  },
};

export default class AppContainer extends React.Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    this.setState(({ theme }) => ({
      theme: theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
        <HomeScreen />
      </ThemeContext.Provider>
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemeContext.Consumer>
          {({ toggleTheme }) => (
            <ThemedButton title="Toggle theme" onPress={toggleTheme} />
          )}
        </ThemeContext.Consumer>
      </ThemedView>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    let { title, ...props } = this.props;
    return (
      <TouchableOpacity {...props}>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <Text style={{ color: ThemeConstants[theme].fontColor }}>
              {title}
            </Text>
          )}
        </ThemeContext.Consumer>
      </TouchableOpacity>
    );
  }
}

class ThemedView extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <View
            {...this.props}
            style={[
              this.props.style,
              { backgroundColor: ThemeConstants[theme].backgroundColor },
            ]}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}