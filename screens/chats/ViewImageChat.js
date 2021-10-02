import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Image, StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import getRecipientUid from '../../utils/getRecipientUid';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ViewImageChat = ({navigation, route}) => {
    const [user, setUser] = useState([]);
    const userLogin = auth().currentUser.uid;
    const routeUser = route.params.users;

    useEffect(()=> {
        firestore().collection("Users").doc(routeUser)
        .onSnapshot(documentSnapshot => {
            setUser(documentSnapshot.data())
        });
        // .onSnapshot((snapshot)=> {
        //     setUser(snapshot.docs.map((doc)=>({data: doc.data()})))
        // });
    },[])
    console.log(user);
    console.log(route.params.users);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
            
            <StatusBar backgroundColor="#000" />
            <View style={{flexDirection: "row", width: "100%", height: 60, alignItems: "center"}}>
                <TouchableOpacity style={{marginLeft: 5}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <Text style={{color: "#FFF", fontSize: 22, marginLeft: 10}}>{userLogin === routeUser ? "You" : user.Nama}</Text>
            </View>
        
            <View style={{height: 500}}>
                <Image source={{uri : route.params.img}} style={{width: "100%", height: 500}} />
            </View>
            <View style={{height: 50, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#FFF", fontSize: 22}}>{route.params.caption}</Text>
            </View>
            
        </SafeAreaView>
    )
}

export default ViewImageChat

const styles = StyleSheet.create({})
