import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'

import ChatsListScreen from './ChatsListScreen'
import GrupChatsList from './GrupChatsList'

const SwiperChats = ({navigation}) => {
    return (
        <Swiper showsPagination={false}>
            <View style={styles.personalChat}>
                <ChatsListScreen navigation={navigation} />
            </View>
            <View style={styles.groupChat}>
                <GrupChatsList navigation={navigation} />
            </View>
        </Swiper>
    )
}

export default SwiperChats

const styles = StyleSheet.create({
    personalChat: {
        flex: 1
    },
    groupChat: {
        flex: 1
    }
})