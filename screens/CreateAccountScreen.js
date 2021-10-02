import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';


const CreateAccountScreen = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [nama, setNama] = useState('');
    const [bio, setBio] = useState('');

    const signOutUser = ()=> {
        auth().signOut().then(()=> {
            navigation.replace("Login");
            console.log("Berhasil Logout")
        });
    };

    // API Firebase

    // Create Account
    const createAccount = async() => {
        let imgUrl = await uploadImage();

        // if( imgUrl == null && userData.userImg ) {
        // imgUrl = userData.userImg;
        // }
        
        firestore().collection('Users').doc(auth().currentUser.uid)
            .set({
                uid: auth().currentUser.uid,
                NomorHp: auth().currentUser.phoneNumber,
                Nama: nama,
                bio: bio,
                fotoProfil: imgUrl,
                Group: []
            },{merge: true})
        firestore().collection("Contacts").doc(auth().currentUser.uid)
            .set({
                bio: bio,
                contactIn: [],
                displayFoto: imgUrl,
                displayName: nama,
                id: auth().currentUser.uid
            },{merge:true})
            .then(()=> {
                console.log("User berhasil dibuat!");
                navigation.replace("HomeScreen");
            })
    }
    // End Create Account
    
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

    // Action Choose Image
    const takePhotoFromCamera = ()=> {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
          }).then(image => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            bs.current.snapTo(1);
          });
    }
    const choosePhotoFromLibrary = ()=> {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7,
          }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            bs.current.snapTo(1);
          });
    }
    
    // Bottom Sheet
    const bs = React.useRef();
    const fall = new Animated.Value(1);

    const renderContent = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelClose}
                onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelTitleClose}>Close</Text>
            </TouchableOpacity>
        </View>
      );
      const renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
      );

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar style="light-content" backgroundColor="#A1C6B9" />

        <BottomSheet
            ref={bs}
            snapPoints={[350, 0]}
            borderRadius={10}
            initialSnap={1}
            callbackNode={fall}
            renderContent={renderContent}
            renderHeader={renderHeader}
            enabledGestureInteraction={true}
        />
        <Animated.View style={{flex: 1,
            opacity: Animated.add(0.2, Animated.multiply(fall, 1.0))
    }}>
            <View style={{alignItems: "center", top: 12, paddingBottom: 10, marginBottom: 15}}>
                <Text style={{fontSize: 30, color: "#FFF", fontWeight: "bold"}}>User Account</Text>
            </View>

            <KeyboardAvoidingView behavior={'position'} contentContainerStyle={styles.body} keyboardVerticalOffset={90}>
                <>
                <TouchableOpacity onPress={()=> bs.current.snapTo(0)}>
                    <ImageBackground 
                            source={{uri: image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}}
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
                <View style={styles.inputContainer}>
                    <Feather name="user" size={26} color="gray" style={{marginHorizontal: 5}} />
                    <TextInput 
                        style={styles.textInput}
                        placeholder="Nama Lengkap"
                        autoCorrect={false}
                        value={nama}
                        onChangeText={(text)=> setNama(text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Feather name="info" size={26} color="gray" style={{marginHorizontal: 5}} />
                    <TextInput 
                        style={styles.textInput}
                        placeholder="Bio"
                        autoCorrect={false}
                        value={bio}
                        onChangeText={(text) => setBio(text)}
                        onSubmitEditing={createAccount}
                    />
                </View>
                
                <TouchableOpacity 
                    activeOpacity={0.5}
                    onPress={createAccount}
                    style={styles.button}
                >
                    <Text style={{color: "#FFF", fontSize: 20, fontWeight: "bold"}}>Buat Akun</Text>
                </TouchableOpacity>
            </>
            </KeyboardAvoidingView>
        </Animated.View>
        </SafeAreaView>
    )
}

export default CreateAccountScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#A1C6B9",
        paddingHorizontal: 10
    },
    body: {
        minHeight: "60%",
        width: "100%",
        backgroundColor: "#FFF",
        paddingVertical: 16,
        paddingRight: 14,
        borderRadius: 32,
        elevation: 2,
        top: 12,
        justifyContent: "flex-start",
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    textInput: {
        width: "80%",
        color: "#000",
        borderBottomWidth: 1, 
        fontSize: 20
    },
    button: {
        width: 180, 
        height: 52, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#42C294",
        alignSelf: "center", 
        marginTop: 20, 
        borderRadius: 12,
    },
    buttonOutline: {
        width: 180,
        height:52,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#42C294",
        alignSelf: "center",
        marginTop: 10, 
        borderRadius: 12
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFF',
        paddingTop: 20,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      panelHeader: {
        alignItems: 'center',
      },
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
      },
      panelTitle: {
        fontSize: 27,
        height: 35,
      },
      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#42C294',
        alignItems: 'center',
        marginVertical: 7,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
      panelClose: {
          padding: 13,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#42C294",
          alignItems: "center",
          marginVertical: 7
      },
      panelTitleClose: {
          fontSize: 17,
          fontWeight: "bold",
          color: "#42C294"
      }
})
