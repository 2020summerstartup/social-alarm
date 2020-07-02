import {createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthLoadingScreen from './authLoadingScreen';
import StackNavigator from './stackNavigation';
import Navigator from './navigation';


const SwitchNavigator = createAppContainer(createSwitchNavigator(
    {
        //AuthLoading:AuthLoadingScreen,
        Auth:StackNavigator,
        App:Navigator,
    }, {
        initialRouteName: 'Auth', //'AuthLoading',
}))

export default SwitchNavigator;