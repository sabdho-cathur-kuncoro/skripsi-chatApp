import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, StyleSheet, RefreshControl } from 'react-native'

const CustomAnggotaGrup = ({id, Nama, fotoProfil, bio, enterUser}) => {
    return (
        <ListItem 
            onPress={()=> enterUser(id,Nama,fotoProfil,bio)}
            containerStyle={{height: 80, backgroundColor: "#FFF"}}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
        >
            <Image 
                source={{uri: fotoProfil}}
                style={{width: 44, height: 44, borderRadius: 12}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {Nama}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {bio}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomAnggotaGrup
