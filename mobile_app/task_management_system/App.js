/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, Header } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome';


import Dashboard from './screens/account/dashboard';
import LogIn from './screens/auth/login';
import Verify from './screens/auth/verification';
import Task from './screens/account/task';


const Stack = createStackNavigator();




export default class App extends Component {

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 5000)
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Log In" component={LogIn} options={{headerShown:false}} />
        <Stack.Screen name="Verify" component={Verify}  />
      
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}} />
        <Stack.Screen name="Task" component={Task}  />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
