import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, TextInput } from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

const PreviewChatImage = ({navigation, route}) => {
    const [image, setImage] = useState(route.params.image);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [input, setInput] = useState("");

    const userLogin = auth().currentUser.uid;

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
            Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
              100,
          );
        });
    
        try {
          await task;
    
          const url = await storageRef.getDownloadURL();
    
          setUploading(false);
          setImage(null);
    
          return url;
        } catch (e) {
          console.log(e);
          return null;
        }
    };

    const updateFoto = async() => {
        // await uploadImage();
        let imgUrl = await uploadImage();

        if(imgUrl == null) {
        imgUrl = route.params.image;
        }

        firestore().collection('personalChat').doc(route.params.chatID).collection("pesanPersonal")
            .add({
                waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
                chatsID: route.params.chatID,
                isiPesan: input,
                urlGambar: imgUrl,
                idPengirim: userLogin,
                tipePesan: "gambar"
            })
        .then(
            navigation.goBack
        )
    }

    console.log(route.params.image);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
            
            <StatusBar backgroundColor="#000" />
            <View style={{flexDirection: "row", width: "100%", height: 60, alignItems: "center"}}>
                <TouchableOpacity style={{marginLeft: 5}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <Text style={{color: "#FFF", fontSize: 20, marginLeft: 5}}>Preview Image</Text>
            </View>
        
            <View style={{flex: 1}}>
                <Image source={{uri : route.params.image}} style={{width: "100%", height: 500}} />
            </View>
            
            <View style={styles.footer}>
                <View style={styles.textInput}>
                <TextInput 
                    value={input}
                    onChangeText={(text)=> setInput(text)}
                    // onSubmitEditing={updateFoto}
                    placeholder="Ketik pesan.."
                    style={{color: "#FFF", fontSize: 14}}
                />
                </View>
                <TouchableOpacity 
                    onPress={updateFoto}
                    activeOpacity={0.5}>
                    <View style={{backgroundColor: "#5dc9a4", marginLeft: 5, alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 22}}>
                        <Ionicons name="send" size={28} color="#FFF" style={{marginLeft: 5}} />
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default PreviewChatImage

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 10,
        marginBottom: 10
    },
    textInput: {
        bottom: 0,
        height: 48,
        flex: 1,
        backgroundColor: "#5c5b5b",
        borderRadius: 30,
        paddingHorizontal: 15,
        // paddingVertical: 10,
        borderColor: "transparent",
        color: "grey",
        flexDirection: "row",
        justifyContent: "space-between"
    }
})