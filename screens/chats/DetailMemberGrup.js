import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import AntDesign from 'react-native-vector-icons/AntDesign'

const DetailMemberGrup = ({navigation, route}) => {
    const [ user, setUser ] = useState([]);

    useEffect(()=> {
        const unsubscribe = firestore().collection("Users")
                                        .doc(route.params.id)
                                        .onSnapshot(documentSnapshot=> {
                                            setUser(documentSnapshot.data());
                                        })
        return unsubscribe;
    },[]);
    console.log(user);

    useLayoutEffect(()=> {
        navigation.setOptions({
            title: user.Nama,
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: "#A1C6B9", elevation: 0},
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            headerLeft: ()=> (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginLeft: 10,flexDirection: "row", alignItems: "center"}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="left" size={28} color="white" />
                    <Text style={{color: "#FFF", fontSize: 14}}>Go Back</Text>
                </TouchableOpacity>
            )
        })
    })
    return (
        <View style={{flex: 1, backgroundColor: "#FFF"}}>
            <Image
            style={{width: "100%", height: 300, marginBottom: 10}}
            source={{uri: user.fotoProfil}}
            />

            <View style={{height: 80, padding: 5, marginBottom: 5, marginHorizontal: 5}}>
                <Text style={{marginVertical: 5, color: "#42C294", fontSize: 18}}>Phone Number</Text>
                <Text style={{color: "#000", fontSize: 20}}>{user.NomorHp}</Text>
            </View>
            <View style={{width: "100%", borderWidth: 0.5, borderStyle: "solid"}}></View>
            
            <View style={{height: 80, padding: 5, marginBottom: 5, marginHorizontal: 5}}>
                <Text style={{marginVertical: 5, color: "#42C294", fontSize: 18}}>Bio</Text>
                <Text style={{color: "#000", fontSize: 20}}>{user.bio}</Text>
            </View>
            <View style={{width: "100%", borderWidth: 0.5, borderStyle: "solid"}}></View>
        </View>
    )
}

export default DetailMemberGrup

const styles = StyleSheet.create({})
