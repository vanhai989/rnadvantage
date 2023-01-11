import React from 'react';
import {StackNavigator} from 'react-navigation';
import ChatScreen from './ChatScreen';
import HomeScreen from './homeScreen';
const Router = StackNavigator({
  Home: {screen: HomeScreen},
  Chat: {screen: ChatScreen},
});
export default Router;
