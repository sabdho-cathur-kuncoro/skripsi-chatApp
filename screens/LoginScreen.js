import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Text, StatusBar, ToastAndroid, KeyboardAvoidingView} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';


const LoginScreen = ({navigation})=> {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');

    // useEffect(()=> {
    //     const unsubscribe = auth().onAuthStateChanged((user)=> {
    //         if(user){
    //             navigation.navigate("CreateAccount");
    //         }
    //     });

    //     return unsubscribe;
    // },[]);

    const signin = async ()=> {
        const confirmation = await auth().signInWithPhoneNumber('+62'+phoneNumber);
        setConfirm(confirmation);
        console.log('mendapatkan kode OTP')
    }

    const confirmCode = async ()=>{
        try {
            await confirm.confirm(code);
            console.log('Kode benar, berhasil login');
            // navigation.navigate("CreateAccount");
        } catch (error) {
            ToastAndroid.show('Kode Salah.', ToastAndroid.SHORT)
            console.log('Kode salah!');
        }
    }

    // const insets = useSafeAreaInsets();
    if (!confirm) {

        return (
        <SafeAreaView style={styles.container}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />

            <View style={{top: 42, paddingBottom: 10, marginBottom: 15}}>
                <Text style={{fontSize: 30, color: "#FFF", fontWeight: "bold"}}>Login Authentication</Text>
            </View>

            <KeyboardAvoidingView style={styles.body} keyboardVerticalOffset={90}>

                <View style={{marginBottom: 15}}>
                    <Text style={{fontSize: 20}}>Masukkan Nomor Telepon</Text>
                </View>
                <View style={styles.inputContainer}>

                    <Text style={{fontSize: 20, color: "#000", padding: 6, borderRightWidth: 2}}>+62</Text>
                    <TextInput 
                        style={{fontSize: 20, marginLeft: 10, color: "#000"}}
                        placeholder="8811223344"
                        value={phoneNumber} 
                        keyboardType="number-pad" 
                        onChangeText={text => setPhoneNumber(text)}
                        onSubmitEditing={signin}
                    />
                </View>

                <TouchableOpacity 
                    activeOpacity={0.5}
                    onPress={()=> signin()}
                    style={styles.button}
                >
                    <Text style={{color: "#FFF", fontSize: 20, fontWeight: "bold"}}>Get OTP</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
        );
    }

    return(
        <SafeAreaView style={styles.container}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />
            <View style={{top: 42, paddingBottom: 10, marginBottom: 15}}>
                <Text style={{fontSize: 30, color: "#FFF", fontWeight: "bold"}}>Verification Code</Text>
            </View>

            <KeyboardAvoidingView style={styles.body} keyboardVerticalOffset={90}>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontSize: 22}}>Masukkan Kode</Text>
                </View>
            
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{fontSize: 22, color: "#000", textAlign: "center"}} 
                        value={code}
                        placeholder="Kode OTP" 
                        keyboardType="number-pad" 
                        onChangeText={text => setCode(text)}
                        onSubmitEditing={confirmCode}
                    />
                </View>
                
                <TouchableOpacity 
                    activeOpacity={0.5}
                    onPress={()=> confirmCode()}
                    style={styles.button}
                >
                    <Text style={{color: "#FFF", fontSize: 20, fontWeight: "bold"}}>Confirm Code</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#A1C6B9",
        paddingHorizontal: 10
    },
    body: {
        flex: 0.5,
        backgroundColor: "#FFF",
        paddingVertical: 15,
        borderRadius: 50,
        elevation: 2,
        top: 42,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    inputContainer: {
        width: "90%",
        height: 66,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row", 
        backgroundColor: "#ECECEC",
        borderColor: "transparent",
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    button: {
        width: 180, 
        height: 52, 
        alignItems: "center", 
        justifyContent: "center", 
        marginTop: 10, 
        backgroundColor: "#42C294", 
        borderRadius: 30,
    }
})

export default LoginScreen;