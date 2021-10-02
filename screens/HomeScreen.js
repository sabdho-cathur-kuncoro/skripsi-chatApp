import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, SafeAreaView, View, Text, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ChatStackScreen from './chats/ChatStackScreen';
import ContactScreen from './contacts/ContactScreen';
import ProfileScreen from './profile/ProfileScreen';
import ProfileStack from './profile/ProfileStack';

const BottomTab = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
    
    return(
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    // let size = 30;
                    
                    if (route.name === 'Chats') {
                        iconName = focused
                        ? 'chatbubble'
                        : 'chatbubble-outline';
                    } else if (route.name === 'Contacts') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#A1C6B9',
                inactiveTintColor: 'gray',
                showLabel: false,
            }}
            >
          <BottomTab.Screen name="Chats" component={ChatStackScreen} />
          <BottomTab.Screen name="Contacts" component={ContactScreen} />
          <BottomTab.Screen name="Profile" component={ProfileStack} />
        </BottomTab.Navigator>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({})