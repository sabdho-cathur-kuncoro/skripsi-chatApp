import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { 
    View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, TextInput 
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from '../../utils/getRecipientUid';

import ImagePicker from 'react-native-image-crop-picker';

const ChatScreen = ({navigation, route}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const scrollViewRef = useRef();
    const userLogin = auth().currentUser.uid;

    const [user] = useAuthState(auth());
    const [recipientSnapshot] = useCollection(
        firestore().collection("Users").where("uid", "==", getRecipientUid(route.params.users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientUid = getRecipientUid(route.params.users, user);
    // console.log(route.params.users);
    const choosePhotoFromLibrary = ()=> {
        ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            compressImageQuality: 0.7,
          }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            // setImage(imageUri);
            navigation.navigate("PreviewImage", {
                image: imageUri,
                chatID: route.params.id
            })
          });
    }
    
    const sendMessage = ()=> {
        firestore().collection("personalChat")
            .doc(route.params.id)
            .collection("pesanPersonal")
            .add({
                waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
                chatsID: route.params.id,
                isiPesan: input,
                idPengirim: userLogin,
                tipePesan: "teks"
            });
        
            setInput("");
    };
    const createChatlist = ()=> {
        firestore().collection("personalChat")
            .doc(route.params.id)
            .update({
                listWaktu: firebase.firestore.FieldValue.serverTimestamp(),
            });
    };

    const createChats =  ()=> {
        sendMessage();
        createChatlist();
    }

    useLayoutEffect(() => {
        const unsubscribe = firestore()
                            .collection("personalChat")
                            .doc(route.params.id)
                            .collection("pesanPersonal")
                            .orderBy("waktuPesan", "asc")
                            .onSnapshot((snapshot)=> {
                                  const estimateTimestamps = {
                                    serverTimestamps: 'estimate'
                                  }
                                    setMessages(
                                        snapshot.docs.map((doc)=> ({
                                            id: doc.id,
                                            data: doc.data(),
                                            waktu: doc.get("waktuPesan") == null ? estimateTimestamps : doc.get("waktuPesan").toDate().toString()
                                        }))
                                    );
                            }
                            )
        
        return unsubscribe;
    }, [route]);
    
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#FFF"}}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />
            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft: 10, flexDirection: "row", alignItems: "center"}}
                    onPress={()=> navigation.goBack()}
                    >
                    <AntDesign name="left" size={32} color="white" />
                    {recipient ? (
                    <Image
                        style={{width: 38, height: 38, borderRadius: 9}}
                        source={{uri: recipient?.fotoProfil}}
                        />
                    ):(<Image style={{width: 42, height: 42, borderRadius: 10}} source={{uri: recipientUid[0]}} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1} 
                    style={{marginLeft: 15}}
                    onPress={()=> navigation.navigate("DetailUser", {idUser: route.params.users})}
                >
                    <Text style={{fontSize: 22, color: "#fff"}}>{recipient ? recipient?.Nama : recipientUid[0]}</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={styles.screen} 
                keyboardVerticalOffset={90}
            >
                <>
                <ScrollView 
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                contentContainerStyle={{backgroundColor: "#FFF", paddingTop: 15}}>
                            {messages.map(({id, data, waktu})=> (
                                data.idPengirim === auth().currentUser.uid ? (
                                    <View key={id} style={styles.bubbles}>
                                        <View  style={styles.sender}>
                                            {data.tipePesan === "teks" ? (
                                                <Text style={styles.senderText}>{data.isiPesan}</Text>
                                            ): (
                                                <>
                                                <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate("ViewImage",{img: data.urlGambar, caption: data.isiPesan, users: data.idPengirim})}>
                                                    <Image source={{uri: data.urlGambar}} style={{width: 200, height: 200, borderRadius: 10}} />
                                                </TouchableOpacity>
                                                <Text>{data.isiPesan}</Text>
                                                </>
                                                )
                                            }
                                            <Text style={styles.timeSender}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.bubblesReceiver}>
                                        <View style={styles.receiver}>
                                            {data.tipePesan === "teks" ? (
                                                <Text style={styles.receiverText}>{data.isiPesan}</Text>
                                            ) : (
                                                <>
                                                <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate("ViewImage", {img: data.urlGambar, caption: data.isiPesan, users: data.idPengirim})}>
                                                    <Image source={{uri: data.urlGambar}} style={{width: 200, height: 200, borderRadius: 10}} />
                                                </TouchableOpacity>
                                                <Text>{data.isiPesan}</Text>
                                                </>
                                            )}
                                            <Text style={styles.timeReceiver}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                )
                            ))}
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.textInput}>
                    <TextInput 
                        value={input}
                        onChangeText={(text)=> setInput(text)}
                        onSubmitEditing={createChats}
                        placeholder="Ketik pesan.."
                    />
                    <TouchableOpacity onPress={choosePhotoFromLibrary} activeOpacity={0.8} style={{justifyContent: "center"}}>
                        <AntDesign name="paperclip" size={28} color="#7a7878" />
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        onPress={createChats}
                        activeOpacity={0.5}>
                        <View style={{backgroundColor: "#8ed1ba", marginLeft: 5, alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 22}}>
                            <Ionicons name="send" size={28} color="#FFF" style={{marginLeft: 5}} />
                        </View>
                    </TouchableOpacity>
                </View>
                </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        borderBottomEndRadius: 20, 
        // elevation: 1, 
        flexDirection: "row",
        alignItems: "center",
    },
    screen: {
        flex: 1, 
        backgroundColor: "#FFF",
    },
    bubbles: {
        width: "100%",
        // backgroundColor: "#ECECEC",
        flexDirection: "row", 
        justifyContent: "flex-end"
    },
    bubblesReceiver: {
        width: "100%", 
        // backgroundColor: "#ECECEC",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    receiver: {
        padding: 15,
        elevation: 2,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-start",
        margin: 5,
        borderRadius: 20,
        maxWidth: "80%",
        position: "relative",
    },
    receiverText: {
        color: "#000",
        fontSize: 16,
        textAlign: "left",
        // fontWeight: "700",
        marginLeft: 10,
        // paddingLeft: 5,
    },
    sender: {
        position: "relative",
        elevation: 2,
        backgroundColor: "#8ed1ba",
        alignSelf: "flex-end",
        marginRight: 15,
        marginBottom: 5,
        padding: 15,
        maxWidth: "80%",
        borderRadius: 20
    },
    senderText: {
        color: "#000",
        paddingRight: 5,
        fontSize: 16,
        textAlign: "right",
        // fontWeight: "700",
        marginLeft: 10,
    },
    timeReceiver: {
        color: "#001000",
        fontSize: 10,
        marginLeft: 10,
        textAlign: "left",
        left: 0,
        bottom: 0,
        marginTop: 5,
    },
    timeSender: {
        color: "#001000",
        // position: "absolute",
        bottom: 0,
        right: 0,
        textAlign: "right",
        fontSize: 10,
        marginRight: 5,
        marginTop: 5,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 48,
        flex: 1,
        backgroundColor: "#ECECEC",
        borderRadius: 30,
        paddingHorizontal: 15,
        // paddingVertical: 10,
        borderColor: "transparent",
        color: "grey",
        flexDirection: "row",
        justifyContent: "space-between"
    }
})