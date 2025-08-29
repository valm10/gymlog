import React from "react";

import {
    Text,
    View,
    Image,
    TextInput
} from 'react-native';

import { style } from "./style";
import Icon from 'react-native-vector-icons/Entypo';
import Logo from '../../assets/logo.png'
import { themas } from "../../global/themes";

export default function Login (){
    return (
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image
                source={Logo}
                style={style.logo}
                resizeMode="contain"
                />
                <Text style={style.text}>Welcome Back</Text>
            </View>

            <View style={style.boxMid}>
            <Text style={style.titleInput}>EMAIL ADDRESS</Text>
            <View style={style.boxInput}>
            <TextInput style={style.input} />
            <Icon name="email" size={20} color={themas.colors.gray} />
            </View>
            <Text style={style.titleInput}>PASSWORD</Text>
            <View style={style.boxInput}>
            <TextInput />
            <Text>...</Text>
            </View>
            </View>

            <View style={style.boxBottom}>
            </View>
        </View>
    )
}