import React from 'react'
import { View, Image, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListItem, Avatar } from 'react-native-elements'
import AntDesign from "react-native-vector-icons/AntDesign"

const ContactScreen = ({navigation}) => {
    const contact = [
        {
            name: "Elon Musk",
            imageUrl: "https://cdn.popbela.com/content-images/post/20210108/elon-musk-4bd53f33cfc95bda8ccc9d3386f26408.jpg",
        },
        {
            name: "Gary Vee",
            imageUrl: "https://assets.entrepreneur.com/content/3x2/2000/20170518183800-gary-vaynerchuk-hero1.jpeg",
        },
        {
            name: "Jeff Bezos",
            imageUrl: "https://aws-dist.brta.in/2020-07/f545af97e8448b31aae35fcd08ccc09838aa7530.jpg",
        },
        {
            name: "Larry Page",
            imageUrl: "https://www.koalahero.com/wp-content/uploads/2019/10/koalahero.com-2.-Larry-Page.jpg",
        },
        {
            name: "Sergey Brin",
            imageUrl: "https://images.bisnis-cdn.com/thumb/posts/2020/06/17/1254159/images---2020-06-17t200402.707_copy_800x500.jpeg?w=744&h=465",
        },
        {
            name: "Sundar Pichai",
            imageUrl: "https://www.akupaham.com/wp-content/uploads/2019/12/vpavic_171003_2029_0067.5.jpg",
        },
        {
            name: "Mark Zuckerberg",
            imageUrl: "https://img.tek.id/img/content/2021/01/08/36055/mark-zuckerberg-perpanjang-blokiran-akun-facebook-trump-wr8Qf8ac0L.jpeg",
        },
        {
            name: "Jack Ma",
            imageUrl: "https://img.idxchannel.com/media/700/images/idx/2019/03/19/Jack_Ma.jpg",
        }
    ]
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
            backgroundColor: "#A1C6B9"
        }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=> navigation.navigate("Swiper")}
                    style={{height: "100%",alignItems: "center", flexDirection: "row"}}
                    >
                    <AntDesign name="left" size={30} color="white" />
                    <Text style={{fontSize: 14, color: "white"}}>Go Back</Text>
                </TouchableOpacity>
                <View style={{left: -30}}>
                    <Text style={{ fontSize: 30, color: "white", fontWeight: "bold"}}>Contacts</Text>
                </View>
                <View></View>
            </View>

            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}>
                {
                    contact.map((l, i) => (
                        <ListItem
                            containerStyle={{height: 80}}
                            key={i} 
                            activeOpacity={0.8} bottomDivider
                            >
                            <Image
                                style={{width: 42, height: 42, borderRadius: 10}}
                                source={{uri: l.imageUrl}}
                                />
                            <ListItem.Content>
                                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                                    {l.name}
                                </ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron size={32} />
                        </ListItem>
                    ))
                }
                </ScrollView>
            </View>
        </View>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between"
    },
    body: {
        flex: 1, 
        elevation: 5, 
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        backgroundColor: "#FFF"
    }
})
