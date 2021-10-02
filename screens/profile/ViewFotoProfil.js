import React from 'react'
import { SafeAreaView, Text, Image, TouchableOpacity, StatusBar } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const ViewFotoProfil = ({navigation,route}) => {
    console.log(route.params.foto);
    return (
        <SafeAreaView style={{backgroundColor: "#000", flex: 1}}>
        <StatusBar backgroundColor="#000" />
            <TouchableOpacity
                onPress={navigation.goBack}
                activeOpacity={0.5}
                style={{top: 10, left: 5, flexDirection: "row", alignItems: "center"}}
            >
                <AntDesign name="arrowleft" size={30} color="white" />
                <Text style={{color: "#FFF",marginLeft: 15, fontSize: 20}}>Profile Photo</Text>
            </TouchableOpacity>
            <Image source={{uri: route.params.foto}} style={{width: "100%", height: 400, marginTop: 80}} />
        </SafeAreaView>
    )
}

export default ViewFotoProfil
