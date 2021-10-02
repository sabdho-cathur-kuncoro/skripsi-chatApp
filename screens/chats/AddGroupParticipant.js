import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomTambahAnggota from '../../components/CustomTambahAnggota';

const AddGroupParticipant = ({navigation, route}) => {
    const [contacts, setContacts] = useState([]);

    const user = auth().currentUser;    

    const getContact = ()=> {
        firestore()
            .collection('Contacts')
            .where('contactIn', 'array-contains', user.uid)
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

    const tambahAnggota = (id,displayName, displayFoto, bio)=> {
        firestore().collection("Users")
                    .doc(id)
                    .set({
                        Group: firestore.FieldValue.arrayUnion(route.params.idGrup)
                    }, {merge: true})

        firestore().collection("groupChat")
                    .doc(route.params.idGrup)
                    .update({
                        anggotaGrup: firestore.FieldValue.arrayUnion(id)
                    })
                    .then(navigation.goBack())
    }

    // console.log(route.params.idGrup);
    // console.log('User ',userData);
    console.log('Data Contact ', contacts);
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
                    <Text style={{ fontSize: 28, color: "white", fontWeight: "bold"}}>Add Participant</Text>
                </View>
            </View>

            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}>
                {
                    contacts.map(({id, data: {displayName, displayFoto, bio}}) => (
                        <CustomTambahAnggota 
                            key={id} 
                            id={id} 
                            displayName={displayName}
                            displayFoto={displayFoto}
                            bio={bio}
                            tambahAnggota={tambahAnggota}
                        />
                    ))
                }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AddGroupParticipant

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