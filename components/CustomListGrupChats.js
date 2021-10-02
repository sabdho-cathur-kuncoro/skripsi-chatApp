import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native'
import moment from 'moment'

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AntDesign from "react-native-vector-icons/AntDesign"

const CustomListGrupChats = ({id, namaGrup, fotoGrup, enterGroup, detailGrup}) => {
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    const user = auth().currentUser.uid;
    useEffect(() => {
        const unsubscribe = firestore()
                            .collection("groupChat")
                            .doc(id)
                            .collection("pesanGrup")
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
        return unsubscribe;
    }, []);

    
    return (
        <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterGroup(id, namaGrup, fotoGrup)} 
                bottomDivider
            >
                <TouchableOpacity activeOpacity={0.7} onPress={()=> detailGrup(id)}>
                <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: fotoGrup}}
                />
                </TouchableOpacity>
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {namaGrup}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail" style={{flexDirection: "row"}}>
                        
                        {chatMessages.tipePesan === "teks" ? (
                            <>
                            {chatMessages.idPengirim === user ? (
                                <Text>You: </Text>
                            ):(
                                <Text>{chatMessages.namaPengirim}: </Text>
                            )}
                            <Text>{chatMessages.isiPesan}</Text>
                            </>
                        ):(
                            <View style={{flexDirection: "row"}}>
                            {chatMessages.idPengirim === user ? (
                                <Text>You: </Text>
                            ):(
                                <Text>{chatMessages.namaPengirim}: </Text>
                            )}
                            <View style={{flexDirection: "row", right: 0}}>
                                <AntDesign name="picture" size={20} color="#8c8f8e" style={{marginRight: 5}} />
                                <Text style={{color: "#8c8f8e"}}>{chatMessages.isiPesan === null ? "Image" : chatMessages.isiPesan}</Text>
                            </View>
                            </View>
                        )}
                    </ListItem.Subtitle>
                </ListItem.Content>
                    <ListItem.Subtitle>
                        {moment(waktu).fromNow()}
                    </ListItem.Subtitle>
                    <ListItem.Chevron size={32} />
            </ListItem>
    )
}

export default CustomListGrupChats
