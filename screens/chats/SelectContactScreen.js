import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomListContacts from '../../components/CustomListContacts';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ContactScreen = ({navigation}) => {
    const [contacts, setContacts] = useState([]);
    
    const user = auth().currentUser.uid;

    const getContact = ()=> {
        firestore()
            .collection('Contacts')
            .where('contactIn', 'array-contains', user)
            .onSnapshot((snapshot)=>
                setContacts(snapshot.docs.map((doc)=> ({
                    id: doc.id,
                    data: doc.data()
                    }))
                )
            );
    }

    useEffect(()=> {
        const unsubscribe = getContact();

        return unsubscribe;
    }, []);


    const chatAlreadyExists = (recipientUid) => 
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user)=> user === recipientUid)?.length > 0
        );
    const createChat = (id,displayName,displayFoto)=> {
        navigation.navigate("CreateChatPersonal",{
            id,
            displayName,
            displayFoto
        })
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#A1C6B9"
        }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={()=> navigation.goBack()}
                    activeOpacity={0.5} style={{position: "absolute", marginLeft: 5, flexDirection: "row", alignItems: "center", left: 0
                }}
                >
                    <AntDesign name="left" size={30} color="white" />
                    <Text style={{color: "#FFF", fontSize: 16}}>Go Back</Text>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 28, color: "white", fontWeight: "bold"}}>Select Contact</Text>
                </View>
            </View>

            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}>
                {
                    contacts.map(({id, data: {displayName, displayFoto}}) => (
                        <CustomListContacts 
                            key={id} 
                            id={id} 
                            displayName={displayName}
                            displayFoto={displayFoto}
                            createChat={createChat}
                        />
                    ))
                }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center"
    },
    body: {
        flex: 1, 
        elevation: 5, 
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        backgroundColor: "#FFF"
    }
})
