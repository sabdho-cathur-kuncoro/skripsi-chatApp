import React, { useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';
import HomeScreen from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatStackScreen from './chats/ChatStackScreen';

const Stack = createStackNavigator();

export default function AppStack() {
    const [isCreateAccount, setCreateAccount] = useState(null);
    let routeName;

    useEffect(() => {
      AsyncStorage.getItem('alreadyCreateAccount').then((value) => {
        if (value == null) {
            AsyncStorage.setItem('alreadyCreateAccount', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
            setCreateAccount(true);
        } else {
            setCreateAccount(false);
        }
      }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
    
    }, []);
  
    if (isCreateAccount === null) {
      return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
    } else if (isCreateAccount == true) {
      routeName = 'CreateAccount';
    } else {
      routeName = 'HomeScreen';
    }

    return (
        <Stack.Navigator 
            initialRouteName={routeName}
        >
            {/* <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> */}
            <Stack.Screen name="CreateAccount" options={{headerShown: false}} component={CreateAccountScreen} />
            <Stack.Screen name="HomeScreen" options={{headerShown: false}} component={ChatStackScreen} />
        </Stack.Navigator>
    )
}
