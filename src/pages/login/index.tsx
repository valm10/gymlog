import React, { useState } from 'react';

import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { style } from "./style";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../../assets/logo.png'
import { themas } from "../../global/themes";

export default function Login (){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function getLogin(){
        try {
            setLoading(true)
            if(!email || !password){
                return Alert.alert('Missing info', 'Please enter email and password.')
            }

            setTimeout(()=>{
                if(email == 'vitor@gmail.com' && password == '123'){
                    Alert.alert('Success')
                } else {
                    Alert.alert('User not found')
                }
                setLoading(false)
            },3000)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image
                source={Logo}
                style={style.logo}
                resizeMode="contain"
                />
                <Text style={style.text}>Gym Log</Text>
            </View>

            <View style={style.boxMid}>
                
            <Text style={style.titleInput}>EMAIL ADDRESS</Text>
            <View style={style.boxInput}>
            <TextInput 
            style={style.input}
            value={email}
            onChangeText={setEmail} />
            <Icon name="email" size={20} color={themas.colors.gray} />
            </View>

            <Text style={style.titleInput}>PASSWORD</Text>
            <View style={style.boxInput}>
            <TextInput 
            style={style.input}
            value={password}
            onChangeText={setPassword} />
            <Icon name="password" size={20} color={themas.colors.gray} />
            </View>

            </View>

            <View style={style.boxBottom}>
                <TouchableOpacity style={style.button} onPress={()=>getLogin()}>
                    {
                    loading?
                    <ActivityIndicator color={'#FFFF'} size={"small"}/>
                    :
                    <Text style={style.textButton}>Log In</Text>
                    }
                </TouchableOpacity>
            </View>
            <Text style={style.textBottom}>Don’t have an account? <Text style={style.textBottomCreate}>Sign up here</Text></Text>
        </View>
    )
}