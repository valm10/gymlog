import React from "react";

import {
    Text,
    View
} from 'react-native';

import { style } from "./style";

export default function Login (){
    return (
        <View style={style.container}>
            <View style={style.boxTop}>
            <Text>Top</Text>
            </View>
            <View style={style.boxMid}>
            <Text>Mid</Text>
            </View>
            <View style={style.boxBottom}>
            <Text>Bottom</Text>
            </View>
        </View>
    )
}