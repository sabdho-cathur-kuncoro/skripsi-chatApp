import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, StyleSheet, Text, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native'
import moment from 'moment'
import CustomListGrupChats from './CustomListGrupChats';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from '../utils/getRecipientUid';
import AntDesign from "react-native-vector-icons/AntDesign"

const CustomListChats = ({id,users,enterChat, detailUser}) => {
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ chatslist, setChatslist ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    const [user] = useAuthState(auth());

    const [recipientSnapshot] = useCollection(
        firestore().collection("Users").where("uid", "==", getRecipientUid(users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientUid = getRecipientUid(users, user);

    const getData = ()=> {
        firestore()
            .collection("personalChat")
            .doc(id)
            .collection("pesanPersonal")
            .orderBy("waktuPesan", "asc")
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    setChatMessages(documentSnapshot.data());

                    // Set Timestamp to Date
                    const timestamp = documentSnapshot.get("waktuPesan");
                    if(timestamp == null){
                        return "";
                    }else {
                        setWaktu(documentSnapshot.get("waktuPesan").toDate().toString())
                    }
                });
            });
    }
    
    useEffect(() => {
        const unsubscribe = getData();

        return unsubscribe;
    }, []);

    return (
            <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterChat(id,users)}
                bottomDivider
                >
                {recipient ? (
                    <TouchableOpacity activeOpacity={0.7} onPress={()=> detailUser(users)}>
                    <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: recipient?.fotoProfil}}
                    />
                    </TouchableOpacity>
                ):(
                    <TouchableOpacity activeOpacity={0.7} onPress={()=> detailUser(users)}>
                    <Image style={{width: 42, height: 42, borderRadius: 10}} source={{uri: recipientUid[0]}} />
                    </TouchableOpacity>
                )}
                
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {recipient ? recipient?.Nama : recipientUid[0]}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                       {chatMessages.tipePesan === "teks" ? 
                            chatMessages.isiPesan :
                            <View style={{flexDirection: "row"}}>
                                <AntDesign name="picture" size={20} color="#8c8f8e" style={{marginRight: 5}} />
                                <Text style={{color: "#8c8f8e"}}>{chatMessages.isiPesan === null ? "Image" : chatMessages.isiPesan}</Text>
                            </View>
                        }
                    </ListItem.Subtitle>
                </ListItem.Content>
                    <ListItem.Subtitle>
                        {moment(waktu).fromNow()}
                    </ListItem.Subtitle>
                    <ListItem.Chevron size={32} />
            </ListItem>
    )
}

export default CustomListChats

const styles = StyleSheet.create({})