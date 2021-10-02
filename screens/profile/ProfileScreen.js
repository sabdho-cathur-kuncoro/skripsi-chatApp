import React, { useState, useEffect } from 'react'
import { View, Modal, Pressable, Platform, KeyboardAvoidingView, Text, StyleSheet, StatusBar, ImageBackground, SafeAreaView, TouchableOpacity } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from "react-native-vector-icons/AntDesign"

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { TextInput } from 'react-native';

const ProfileScreen = ({navigation}) => {
    const [userData, setUserData] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [nama, setNama] = useState('');
    const [bio, setBio] = useState('');
    const [group, setGroup] = useState([]);
    const user = auth().currentUser.uid;

    const [modalNama, setModalNama] = useState(false);
    const [modalBio, setModalBio] = useState(false);

    // Bottom Sheet
    const bs = React.useRef();
    const bsName = React.useRef();
    const bsBio = React.useRef();
    const fall = new Animated.Value(1);

    // Bottom Sheet Photo Profile
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
    // End Bottom Sheet

    // Action Upload Image
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
            updateFoto();
          });
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
            bs.current.snapTo(1);
            updateFoto();
          });
    }

    // Update Data User
    const updateFoto = async() => {
        let imgUrl = await uploadImage();

        if( imgUrl == null && userData.fotoProfil ) {
        imgUrl = userData.fotoProfil;
        }

        firestore().collection('Users').doc(auth().currentUser.uid)
            .update({
                fotoProfil: imgUrl
            })
        firestore().collection('Contacts').doc(auth().currentUser.uid)
            .update({
                displayFoto: imgUrl
            })
            .then(() => {
                console.log("Foto profil berhasil diupdate!");
            })
        }
        
        const updateName = ()=> {
            // Update database Users
            firestore().collection('Users').doc(auth().currentUser.uid)
            .update({
                Nama: nama
            })
            // Update database Contacts
            firestore().collection('Contacts').doc(auth().currentUser.uid)
            .update({
                displayName: nama
            })

            .then(()=> {
                console.log("Nama berhasil diupdate!");
                setModalNama(!modalNama);
            })
    }

    const updateBio = ()=> {
        firestore().collection('Users').doc(auth().currentUser.uid)
            .update({
                bio: bio
            })
        firestore().collection('Contacts').doc(auth().currentUser.uid)
            .update({
                bio: bio
            })
            .then(()=> {
                console.log("Bio berhasil diupdate!");
                setModalBio(!modalBio);
            })
    }

    // API Firebase
    const getUser = () => {
        firestore()
            .collection('Users')
            .doc(user)
            .onSnapshot(documentSnapshot => {
                console.log('User data: ', documentSnapshot.data());
                setUserData(documentSnapshot.data());
            })
    }

    useEffect(() => {
        const unsubscribe = getUser();
        return unsubscribe;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />

            {/* BottomSheet */}
            <BottomSheet
                ref={bs}
                snapPoints={[330, 0]}
                borderRadius={10}
                initialSnap={1}
                callbackNode={fall}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction={true}
            />

            {/* Modal */}
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
                        <Text style={{fontSize: 20, paddingTop: 10, paddingLeft: 10, color: "#42C294", fontWeight: "bold"}}>Masukkan nama</Text>
                        <TextInput 
                            style={{borderBottomWidth: 1, borderColor: "#42C294", fontSize: 18}}
                            value={nama}
                            maxLength={26}
                            onChangeText={(text)=> setNama(text)}
                        />
                        <View style={{flexDirection: "row", padding: 10, justifyContent: "flex-end", marginTop: 15}}>
                        <Pressable 
                            style={{marginRight: 10}}
                            onPress={()=> { setModalNama(!modalNama) }}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            onPress={updateName}
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
                visible={modalBio}
                onRequestClose={()=> {
                    setModalBio(!modalBio);
                }}
            >
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#aaadab"}}>
                    <View style={{width: 350, height: 150, backgroundColor: "#FFF", borderRadius: 20, elevation: 3}}>
                        <Text style={{fontSize: 20, paddingTop: 10, paddingLeft: 10, color: "#42C294", fontWeight: "bold"}}>Masukkan bio</Text>
                        <TextInput 
                            style={{borderBottomWidth: 1, borderColor: "#42C294", fontSize: 18}}
                            value={bio}
                            selectTextOnFocus={true}
                            maxLength={20}
                            onChangeText={(text)=> setBio(text)}
                        />
                        <View style={{flexDirection: "row", padding: 10, justifyContent: "flex-end", marginTop: 15}}>
                        <Pressable 
                            style={{marginRight: 10}}
                            onPress={()=> { setModalBio(!modalBio) }}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            onPress={updateBio}
                        >
                            <Text style={{fontSize: 20, color: "#42C294", fontWeight: "bold"}}>Save</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End Modal */}

            <Animated.View style={{flex: 1, backgroundColor: "#A1C6B9",
            opacity: Animated.add(0.2, Animated.multiply(fall, 1.0))
            }}>

            <View style={styles.headerTop}>
                <TouchableOpacity style={{marginRight: 5}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={32} color="white" />
                </TouchableOpacity>
                <Text style={{fontSize: 28, fontWeight: "bold", color: "#FFF"}}>Profile</Text>
            </View>
            

            <View style={{flex: 0.8, elevation: 0, marginLeft: 40, backgroundColor: "#FFF", borderBottomStartRadius: 30, borderTopStartRadius: 30}}>

            {/* Foto User */}
            <TouchableOpacity onPress={()=> navigation.navigate("ViewFoto",{foto: userData.fotoProfil})} activeOpacity={0.5} 
                style={styles.image, {left: 90, marginTop: 10}}
            >
                <ImageBackground
                        style={{width: 150, height: 150, borderRadius: 20}}
                        imageStyle={{borderRadius: 20}}
                        source={{uri: userData.fotoProfil || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}} 
                />
                    
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=> bs.current.snapTo(0)}>
                            <View style={{
                                    height: 50,
                                    width: 50,
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    backgroundColor: "#42C294",
                                    borderRadius: 20,
                                    top: -28,
                                    right: -215,
                                    // opacity: 0.8
                                }}>
                                <Ionicons name="camera" size={26} color="#FFF" />
                            </View>
            </TouchableOpacity>

                {/* Text User */}
                <TouchableOpacity style={styles.innerBody} onPress={()=> { setModalNama(true) }}>
                    <Feather name="user" size={30} color="#5c635e" style={{marginHorizontal: 15, marginVertical: 5, marginRight: 10}} />
                    <View style={{width: "66%", height: 100, marginLeft: 15}}>
                        <Text style={styles.subtitle}>Name</Text>
                        <Text style={styles.text}>{userData.Nama}</Text>
                    </View>

                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <MaterialIcons name="edit" size={35} color="#42C294" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.innerBody} onPress={()=> { setModalBio(true) }}>
                    <Feather name="info" size={30} color="#5c635e" style={{marginHorizontal: 15, marginVertical: 5, marginRight: 10}} />
                    <View style={{width: "66%", height: 100, marginLeft: 15}}>
                        <Text style={styles.subtitle}>Bio</Text>
                        <Text style={styles.text}>{userData.bio}</Text>
                    </View>

                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <MaterialIcons name="edit" size={35} color="#42C294" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.innerBody} onPress={()=> {}}>
                    <Feather name="phone" size={30} color="#5c635e" style={{marginHorizontal: 15, marginVertical: 5, marginRight: 10}} />
                    <View style={{width: "66%", height: 100, marginLeft: 15}}>
                        <Text style={styles.subtitle}>Phone</Text>
                        <Text style={styles.text}>{userData.NomorHp}</Text>
                    </View>
                </TouchableOpacity>

            </View>

            </Animated.View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#A1C6B9"
    },
    headerTop: {
        flex: 0.1,
        backgroundColor: "#A1C6B9",
        alignItems: "center",
        flexDirection: "row",
        padding: 10
    },
    image: {
        alignItems: "center",
        justifyContent: "center",
        borderTopStartRadius: 30,
    },
    innerBody: {
        height: 80,
        padding: 5,
        flexDirection: "row",
        marginBottom: 5,
        marginHorizontal: 5
    },
    button: {
        width: 180, 
        height: 52, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#42C294",
        alignSelf: "center", 
        marginTop: 10, 
        borderRadius: 12,
        marginTop: 15
    },
    text: {
        color: "#000",
        fontSize: 20
    },
    subtitle: {
        marginVertical: 5,
        color: "#5c635e",
        fontSize: 16
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
