import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CustomListItem = ({ id, displayName, displayFoto, createChat }) => {

    return (
        <ListItem
            containerStyle={{height: 80}}
            // id={id}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
            onPress={() => createChat(id,displayName,displayFoto)}
            key={id}
        >
            <Image
                style={{width: 42, height: 42, borderRadius: 10}}
                source={{uri: displayFoto}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {displayName}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron size={32} />
        </ListItem>
    )
}

export default CustomListItem;

const styles = StyleSheet.create({});
