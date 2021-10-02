import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from '../../utils/getRecipientUid';
import auth, { firebase } from '@react-native-firebase/auth';

const DetailUserScreen = ({navigation, route}) => {
    // const [user, setUser] = useState([]);
    const [user] = useAuthState(auth());

    const [recipientSnapshot] = useCollection(
        firestore().collection("Users").where("uid", "==", getRecipientUid(route.params.idUser, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientUid = getRecipientUid(route.params.idUser, user);

    // console.log(recipient);

    useLayoutEffect(()=> {
        navigation.setOptions({
            title: recipient ? recipient.Nama : recipientUid[0],
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: "#A1C6B9", elevation: 0},
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            headerLeft: ()=> (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginLeft: 10,flexDirection: "row", alignItems: "center"}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="left" size={28} color="white" />
                    <Text style={{color: "#FFF", fontSize: 14}}>Go Back</Text>
                </TouchableOpacity>
            )
        })
    })
    return (
        <View style={{flex: 1, backgroundColor: "#FFF"}}>
                {recipient ? (
                    <Image
                    style={{width: "100%", height: 300, marginBottom: 10}}
                    source={{uri: recipient?.fotoProfil}}
                    />
                ):(<Image style={{width: 42, height: 42, borderRadius: 10}} source={{uri: recipientUid[0]}} />
                )}

                <View style={{height: 80, padding: 5, marginBottom: 5, marginHorizontal: 5}}>
                    <Text style={{marginVertical: 5, color: "#42C294", fontSize: 18}}>Phone Number</Text>
                    <Text style={{color: "#000", fontSize: 20}}>{recipient ? recipient.NomorHp : recipientUid[0]}</Text>
                </View>
                <View style={{width: "100%", borderWidth: 0.5, borderStyle: "solid"}}></View>
                
                <View style={{height: 80, padding: 5, marginBottom: 5, marginHorizontal: 5}}>
                    <Text style={{marginVertical: 5, color: "#42C294", fontSize: 18}}>Bio</Text>
                    <Text style={{color: "#000", fontSize: 20}}>{recipient ? recipient.bio : recipientUid[0]}</Text>
                </View>
                <View style={{width: "100%", borderWidth: 0.5, borderStyle: "solid"}}></View>
        </View>
    )
}

export default DetailUserScreen

const styles = StyleSheet.create({})
