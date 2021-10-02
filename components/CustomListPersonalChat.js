import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, StyleSheet, RefreshControl } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'
import CustomListGrupChats from './CustomListGrupChats';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const CustomListPersonalChat = ({id, displayName, displayFoto, enterChat}) => {
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ chatslist, setChatslist ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    const getData = ()=> {
        firestore()
            .collection("Chats")
            .doc(id)
            .collection("Messages")
            .orderBy("waktuPesan", "asc")
            .onSnapshot(querySnapshot => {
                // console.log('Total data: ', querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    // console.log('Data: ', documentSnapshot.id, documentSnapshot.data());
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
    const getChatslist = ()=> {
        firestore()
            .collection("Chatslist")
            .doc(auth().currentUser.uid)
            .collection("ChatsID")
            // .where("tipeChat", "==", "Private")
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    // console.log('Chatslist: ', documentSnapshot.id, documentSnapshot.data());
                    setChatslist(documentSnapshot.data());
                })
            })
    }
    useEffect(() => {
        const unsubscribe = getData();
                            getChatslist();
        return unsubscribe;
    }, []);
    return (
        <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterChat(id, displayName, displayFoto)} 
                bottomDivider
                >
                <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: displayFoto}}
                />
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {displayName}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                        {chatMessages.isiPesan}
                    </ListItem.Subtitle>
                </ListItem.Content>
                    <ListItem.Subtitle>
                        {moment(waktu).format('LT')}
                    </ListItem.Subtitle>
                    <ListItem.Chevron size={32} />
            </ListItem>
    )
}

export default CustomListPersonalChat
