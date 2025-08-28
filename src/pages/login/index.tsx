import React from "react";

import {
    Text,
    View,
    Image,
    TextInput
} from 'react-native';

import { style } from "./style";

import Logo from '../../assets/logo.png'

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
            <Text>Email Address</Text>
            <TextInput />
            <Text>Password</Text>
            <TextInput />
            </View>

            <View style={style.boxBottom}>
            </View>
        </View>
    )
}