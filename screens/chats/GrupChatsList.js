import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, SafeAreaView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpeedDial } from 'react-native-elements';
// import { FAB } from 'react-native-elements';
import { FAB, Portal, Provider } from 'react-native-paper';

import CustomListGrupChats from '../../components/CustomListGrupChats';
import { Icon } from 'react-native-vector-icons/Feather';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const GrupChatsList = ({navigation}) => {
    const [ state, setState ] = useState({ open: false });
    const [ groupChat, setGroupChat ] = useState([]);
    const [ groupChatslist, setGroupChatslist ] = useState([]);
    const [userData, setUserData] = useState([]);

    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;
    const user = auth().currentUser.uid;
    
    useEffect(()=> {
        firestore().collection("Users").doc(user).onSnapshot(documentSnapshot=> {
            setUserData(documentSnapshot.data());
        })
    },[]);

    const getData = ()=> {

        firestore().collection('groupChat')
                        .where('anggotaGrup', 'array-contains', user)
                        .orderBy('listWaktu', 'desc')
                        .onSnapshot((snapshot) =>
                            setGroupChat(snapshot.docs.map((doc)=> ({
                                id: doc.id,
                                data: doc.data(),
                            })))
                        );
    }
    useEffect(()=> {
        const unsubscribe = getData();
        return unsubscribe;
    },[])
    // console.log(groupChat.anggotaGrup);
    const enterGroup = (id, namaGrup, fotoGrup)=> {
        navigation.navigate("GrupChatScreen", {
            id,
            namaGrup,
            fotoGrup
        })
    }
    const detailGrup = (id)=> {
        navigation.navigate("DetailGroup", {
            idGrup: id,
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
                    <Image source={{uri: userData.fotoProfil}} style={{width: 38, height: 38, borderRadius: 10, marginLeft: 20}} />
                    <Text style={{marginLeft: 5, color: "#FFF", fontSize: 18, fontWeight: "bold"}}>{userData.Nama}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "bold"}}>Groups</Text>
            </View>
            
            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}
                >
                    {
                    // groupChatslist.map(({id})=> (
                        groupChat.map(({id,data: {namaGrup,fotoGrup }})=> (
                            <CustomListGrupChats 
                                key={id}
                                id={id}
                                namaGrup={namaGrup}
                                fotoGrup={fotoGrup}
                                enterGroup={enterGroup}
                                detailGrup={detailGrup}
                            />
                        ))
                    // ))
                    }
                    
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

export default GrupChatsList

const styles = StyleSheet.create({
    header: {
        flex: 0.2, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center"
    },
    body: {
        flex: 1, 
        elevation: 5, 
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        backgroundColor: "#fff"
    }
})