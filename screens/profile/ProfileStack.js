import React, { useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import ProfileScreen from './ProfileScreen';
import ViewFotoProfil from './ViewFotoProfil';

const ProfilStack = createStackNavigator();

const ProfileStack = ({navigation, route}) => {
    useLayoutEffect(()=> {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "ViewFoto"){
            navigation.setOptions({tabBarVisible: false});
        }else {
            navigation.setOptions({tabBarVisible: true});
        }
    },[navigation, route]);
    return (
        <ProfilStack.Navigator>
            <ProfilStack.Screen name="ProfilScreen" options={{headerShown: false}} component={ProfileScreen} />
            <ProfilStack.Screen name="ViewFoto" options={{headerShown: false}} component={ViewFotoProfil} />
        </ProfilStack.Navigator>
    )
}

export default ProfileStack
