import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CustomTambahAnggota = ({id,displayName,displayFoto,bio, tambahAnggota}) => {
    return (
        <ListItem 
            containerStyle={{height: 80}}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
        >
            <Image 
                source={{uri: displayFoto}}
                style={{width: 44, height: 44, borderRadius: 12}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {displayName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {bio}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content></ListItem.Content>
            <ListItem.Content style={{alignItems: "flex-end", marginRight: 10}}>
                <TouchableOpacity onPress={()=> tambahAnggota(id,displayName, displayFoto, bio)}>
                    <AntDesign name="addusergroup" size={36} color="#8ed1ba" />
                </TouchableOpacity>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomTambahAnggota
