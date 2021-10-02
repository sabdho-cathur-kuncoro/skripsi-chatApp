import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Pressable, Image, ImageBackground, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import CustomAnggotaGrup from '../../components/CustomAnggotaGrup';

const DetailGroupScreen = ({navigation, route}) => {
    const [detailGroup, setDetailGroup] = useState([]);
    const [jumlahAnggota, setJumlahAnggota] = useState("");
    const [waktu, setWaktu] = useState([]);
    const [userData, setUserData] = useState([]);
    const [namaGrup, setNamaGrup] = useState("");
    const [deskripsiGrup, setDeskripsiGrup] = useState("");
    const user = auth().currentUser.uid;
    
    const [modalNama, setModalNama] = useState(false);
    const [modalDeskripsi, setModalDeskripsi] = useState(false);

    useEffect(()=>{
        const unsubscribe = firestore().collection("groupChat")
                                        .doc(route.params.idGrup)
                                        .onSnapshot(documentSnapshot => {
                                            setDetailGroup(
                                                documentSnapshot.data()
                                            )
                                            // Set Timestamp to Date
                                            const timestamp = documentSnapshot.get("waktuBuatGrup");
                                            if(timestamp == null){
                                                return "";
                                            }else {
                                                setWaktu(documentSnapshot.get("waktuBuatGrup").toDate().toString())
                                            }
                                        })
        return unsubscribe;
    },[])
    
    // Get Total Users
    useEffect(()=> {
        const unsubscribe = firestore().collection("Users")
                                        .where('Group', 'array-contains', route.params.idGrup)
                                        .onSnapshot(querySnapshot => {
                                            console.log('Total users: ', querySnapshot.size);
                                            setJumlahAnggota(querySnapshot.size);
                                        })
                            
        return unsubscribe;
    },[])

    // Get Data User
    const idGrup = route.params.idGrup;
    const getDataUser= ()=> {

            firestore().collection("Users")
            .where('Group', 'array-contains', idGrup)
            .onSnapshot((snapshot) =>
                setUserData(snapshot.docs.map((doc)=> ({
                    id: doc.id,
                    data: doc.data(),
                    })))
            );
    }
    useEffect(()=> {
        const unsubscribe = getDataUser();

        return unsubscribe;
    },[])

    const enterUser = (id, Nama, fotoProfil, bio)=> {
        navigation.navigate("MemberGrup", {
            id,
            Nama,
            fotoProfil,
            bio
        })
    }

    const updateNamaGrup = ()=> {
        firestore().collection("groupChat").doc(idGrup).update({
            namaGrup: namaGrup
        })
        .then(()=> {
            console.log("Nama berhasil diupdate!");
            setModalNama(!modalNama);
        })
    }
    const updateDeskripsiGrup = ()=> {
        firestore().collection("groupChat").doc(idGrup).update({
            deskripsiGrup: deskripsiGrup
        })
        .then(()=> {
            console.log("Deskripsi berhasil diupdate!");
            setModalDeskripsi(!modalDeskripsi);
        })
    }

    const exitGrup = ()=> {
        firestore().collection("groupChat").doc(idGrup).update({
            anggotaGrup: firestore.FieldValue.arrayRemove(user)
        })

        firestore().collection("Users").doc(user).update({
            Group: firestore.FieldValue.arrayRemove(idGrup)
        })
        .then(
            navigation.navigate("Swiper")
        )
    };

    useLayoutEffect(()=> {
        navigation.setOptions({
            title: "Grup Detail",
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: "#A1C6B9", elevation: 0},
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            headerLeft: ()=> (
                    <TouchableOpacity 
                        style={{marginLeft: 10, flexDirection: "row", alignItems: "center"}}
                        onPress={navigation.goBack}
                        >
                        <AntDesign name="left" size={30} color="white" />
                        <Text style={{color: "#FFF", fontSize: 16}}>Go Back</Text>
                    </TouchableOpacity>
            ),
        })
    }, []);
    console.log(idGrup);
    return (
        <View style={{flex: 1, backgroundColor: "#ECECEC"}}>
            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalDeskripsi}
                onRequestClose={()=> {
                    setModalDeskripsi(!modalDeskripsi);
                }}
            >
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#aaadab"}}>
                    <View style={{width: 350, height: 150, backgroundColor: "#FFF", borderRadius: 20, elevation: 3}}>
                        <Text style={{fontSize: 20, paddingTop: 10, paddingLeft: 10, color: "#42C294", fontWeight: "bold"}}>Deskripsi Grup</Text>
                        <TextInput 
                            style={{borderBottomWidth: 1, borderColor: "#42C294", fontSize: 18}}
                            value={deskripsiGrup}
                            maxLength={26}
                            onChangeText={(text)=> setDeskripsiGrup(text)}
                        />
                        <View style={{flexDirection: "row", padding: 10, justifyContent: "flex-end", marginTop: 15}}>
                        <Pressable 
                            style={{marginRight: 10}}
                            onPress={()=> { setModalDeskripsi(!modalDeskripsi) }}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            onPress={updateDeskripsiGrup}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Save</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalNama}
                onRequestClose={()=> {
                    setModalNama(!modalNama);
                }}
            >
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#aaadab"}}>
                    <View style={{width: 350, height: 150, backgroundColor: "#FFF", borderRadius: 20, elevation: 3}}>
                        <Text style={{fontSize: 20, paddingTop: 10, paddingLeft: 10, color: "#42C294", fontWeight: "bold"}}>Nama Grup</Text>
                        <TextInput 
                            style={{borderBottomWidth: 1, borderColor: "#42C294", fontSize: 18}}
                            value={namaGrup}
                            maxLength={26}
                            onChangeText={(text)=> setNamaGrup(text)}
                        />
                        <View style={{flexDirection: "row", padding: 10, justifyContent: "flex-end", marginTop: 15}}>
                        <Pressable 
                            style={{marginRight: 10}}
                            onPress={()=> { setModalNama(!modalNama) }}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            onPress={updateNamaGrup}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Save</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal */}

            <ScrollView>
            <ImageBackground
                source={{
                    uri: detailGroup.fotoGrup
                }}
                style={{width: "100%", height: 300, justifyContent: "flex-end"}}
            >
                <View style={{marginLeft: 5}}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={()=> setModalNama(true)}
                        style={{flexDirection: "row", width: "100%", alignItems: "center"}}
                    >
                            <Text style={{fontSize: 22, color: "#fff", marginRight: 10}}>{detailGroup.namaGrup}</Text>
                        <AntDesign name="edit" size={22} color="#42C294" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, color: "#fff"}}>Dibuat: {moment(waktu).format('LLL')}</Text>
                </View>
            </ImageBackground>
            <View style={{backgroundColor: "#FFF", width: "100%", height: 62}}>
                <View style={{paddingLeft: 5}}>
                    <Text style={{fontSize: 22, color: "#8ed1ba"}}>Description</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={()=> setModalDeskripsi(true)}
                        style={{flexDirection: "row", width: "100%", alignItems: "center"}}
                    >
                        <Text style={{fontSize: 20, marginRight: 10}}>{detailGroup.deskripsiGrup}</Text>
                        <AntDesign name="edit" size={22} color="#42C294" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{backgroundColor: "#FFF", marginTop: 10, width: "100%", flex: 1}}>
                <View style={{paddingLeft: 5, justifyContent: "space-between"}}>
                    
                        <TouchableOpacity 
                        // key={id}
                        style={{flexDirection: "row", alignItems: "center", marginVertical: 5}}
                        onPress={()=> navigation.navigate("AddParticipant", {idGrup: route.params.idGrup})}
                        activeOpacity={0.5}
                    >
                        <View style={{width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#8ed1ba"}}>
                            <AntDesign name="addusergroup" size={30} color="#FFF" />
                        </View>
                        <Text style={{fontSize: 20, marginLeft: 5}}>Add Participants</Text>
                    </TouchableOpacity>                                            
                    
                    <Text style={{fontSize: 22, color: "#8ed1ba"}}>{jumlahAnggota} Participants</Text>

                {/* <ScrollView style={{flex: 1, backgroundColor: "#000"}}> */}
                    {
                        userData.map(({id,data: {Nama,fotoProfil,bio }})=> (
                            <CustomAnggotaGrup 
                                key={id}
                                id={id}
                                Nama={Nama}
                                fotoProfil={fotoProfil}
                                bio={bio}
                                enterUser={enterUser}
                            />
                        ))
                    }
                {/* </ScrollView> */}
                </View>
            </View>
            <TouchableOpacity
                onPress={exitGrup} 
                style={{backgroundColor: "#FFF", marginTop: 5, marginLeft: 10, flexDirection: "row", width: "100%", height: 50, alignItems: "center", justifyContent: "flex-start"}}
            >
                    <AntDesign name="logout" size={22} color="red" />
                    <Text style={{fontSize: 18, color: "red", marginLeft: 10}}>EXIT GROUP</Text>
            </TouchableOpacity>
            </ScrollView>

        </View>
    )
}

export default DetailGroupScreen

const styles = StyleSheet.create({})