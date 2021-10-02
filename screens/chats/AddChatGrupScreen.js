import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Input } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';


import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userData, setUserData] = useState('');

    useEffect(()=> {
        const unsubscribe = firestore()
                            .collection('Users')
                            .doc(auth().currentUser.uid)
                            .onSnapshot(documentSnapshot => {
                                const userId = documentSnapshot.get("uid");
                                const nama = documentSnapshot.get("Nama");
                                const foto = documentSnapshot.get("fotoProfil");
                                const bio = documentSnapshot.get("bio")
                                setUserData({
                                    idUser: userId,
                                    namaUser: nama,
                                    fotoUser: foto,
                                    bioUser: bio
                                });
                            })
                            
        return unsubscribe;
    },[])

    // Upload Image
    const uploadImage = async () => {
        if( image == null ) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Menambahkan timestamp ke nama file
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
            );
        });

        try{
            await task;
            const url = await storageRef.getDownloadURL();

            setUploading(false);
            setImage(null);

            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    const choosePhotoFromLibrary = ()=> {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            uploadImage();
          });
    }

    useLayoutEffect(()=> {
        navigation.setOptions({
            title: "Buat Grup Baru",
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: "#A1C6B9", elevation: 0},
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            // headerBackTitle: "Chats",
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

    const createChatGrup = async ()=> {
        let imgUrl = await uploadImage();

        if( imgUrl == null && image ) {
        imgUrl = image;
        }
        const user = auth().currentUser.uid;
        const randomNumber = Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 100);
        const idGrup = "Grup_" + randomNumber;
        
            // Membuat Grup pada database
            firestore().collection("groupChat")
                .doc(idGrup)
                .set({
                    groupID: idGrup,
                    namaGrup: input,
                    fotoGrup: imgUrl !== null ? imgUrl : "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_960_720.png",
                    anggotaGrup: [user],
                    pembuatGrup: user,
                    deskripsiGrup: deskripsi,
                    waktuBuatGrup: firebase.firestore.FieldValue.serverTimestamp(),
                    listWaktu: firebase.firestore.FieldValue.serverTimestamp()
                });

            // Menambahkan User ke Grup
            firestore().collection("Users")
                .doc(user)
                .update({
                    Group: firestore.FieldValue.arrayUnion(idGrup)
                })

            // Membuat Pesan Grup pada database
            firestore().collection("groupChat")
                .doc(idGrup)
                .collection("pesanGrup")
                .add({
                    idPengirim: user,
                    namaPengirim: userData.namaUser,
                    fotoPengirim: userData.fotoUser,
                    isiPesan: "Grup dibuat!",
                    tipePesan: "teks",
                    waktuPesan: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(()=> {
                    console.log("Grup berhasil dibuat!")
                    navigation.goBack();
                })
                .catch((error)=> alert(error));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={choosePhotoFromLibrary}>
                    <ImageBackground 
                            source={{uri: image || "https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_960_720.png"}}
                            style={{alignSelf: 'center', marginBottom: 10, marginTop: 10, width: 130, height: 130}}
                            imageStyle={{borderRadius: 18}}
                    >
                        <View style={{
                                height: 40,
                                width: 40,
                                alignItems: "center", 
                                justifyContent: "center",
                                backgroundColor: "#42C294",
                                borderRadius: 20,
                                top: 100,
                                right: -105,
                                opacity: 0.8
                            }}>
                            <Ionicons name="camera" size={26} color="#FFF" />
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            <Input 
                placeholder="Nama Grup"
                value={input}
                onChangeText={(text)=> setInput(text)}
            />
            <Input 
                placeholder="Deskripsi"
                value={deskripsi}
                onChangeText={(text)=> setDeskripsi(text)}
            />
            <TouchableOpacity 
                disabled={!input}
                onPress={createChatGrup}
                style={{alignItems: "center"}}
            >
                <View style={styles.button}>
                    <Text style={{color: "#FFF", fontSize: 20}}>Buat Grup</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
};

export default AddChatScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%"
    },
    button: {
        backgroundColor: "#42C294", 
        alignItems: "center", 
        justifyContent: "center", 
        width: 200, 
        height: 50, 
        borderRadius: 12
    }
});
