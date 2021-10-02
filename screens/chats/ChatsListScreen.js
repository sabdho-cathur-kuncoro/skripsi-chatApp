import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StatusBar, ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native'
import { FAB, Portal, Provider } from 'react-native-paper';

import CustomListChats from '../../components/CustomListChats';
import AntDesign from "react-native-vector-icons/AntDesign"

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const ChatsListScreen = ({navigation}) => {
    const [ state, setState ] = useState({ open: false });
    const [userData, setUserData] = useState([]);

    const user = auth().currentUser.uid;
    const userChatRef = firestore().collection("personalChat").where("users", "array-contains", user).orderBy("listWaktu","desc");
    const [chatsSnapshot] = useCollection(userChatRef);

    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    useEffect(()=> {
        firestore().collection("Users").doc(user).onSnapshot(documentSnapshot=> {
            setUserData(documentSnapshot.data());
        })
    },[]);

    // console.log(userData);
    const enterChat = (id, users)=> {
        navigation.navigate("ChatScreen", {
            id,
            users
        })
    }
    const detailUser = (users)=> {
        navigation.navigate("DetailUser",{
            idUser: users
        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#A1C6B9"
          }} 
          >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />

            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=> navigation.navigate("ProfileStack")}
                    style={{alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginTop: 5}}
                >
                    <Image source={{uri: userData.fotoProfil || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}} style={{width: 38, height: 38, borderRadius: 10, marginLeft: 20}} />
                    <Text style={{marginLeft: 5, color: "#FFF", fontSize: 18, fontWeight: "bold"}}>{userData.Nama}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=> navigation.navigate("Contacts")}
                    style={{marginRight: 10}}
                >
                    <AntDesign name="contacts" size={34} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{alignItems: "center"}}>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "bold"}}>Personal</Text>
            </View>
            
            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}
                    
                >
                    {/* List of Chats */}
                    {chatsSnapshot?.docs.map((chat)=> (
                        <CustomListChats 
                            key={chat.id} 
                            id={chat.id} 
                            users={chat.data().users}
                            enterChat={enterChat}
                            detailUser={detailUser}
                        />
                    ))}
                </ScrollView>
                
                <Provider>
                <Portal>
                    <FAB.Group
                    open={open}
                    color= "#FFF"
                    icon={open ? 'close' : 'plus'}
                    fabStyle={{backgroundColor: "#42C294"}}
                    actions={[
                        {
                        icon: 'forum',
                        color: '#42C294',
                        label: 'Pesan Grup',
                        small: false,
                        onPress: () => navigation.navigate("AddGrup"),
                        },
                        {
                        icon: 'message',
                        label: 'Pesan Personal',
                        color: '#42C294',
                        small: false,
                        onPress: () => navigation.navigate("SelectContact"),
                        },
                    ]}
                    onStateChange={onStateChange}
                    />
                </Portal>
                </Provider>
            </View>
            
        </SafeAreaView>
    )
}

export default ChatsListScreen

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    body: {
        flex: 1, 
        elevation: 5, 
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        backgroundColor: "#fff"
    }
})