import React from 'react';
import ChatScreen from '../routers/ChatScreen';
import HomeScreen from '../routers/homeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReactHookForm from '../routers/reactHookForm';

const HomeStackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ReactHookForm" component={ReactHookForm} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
