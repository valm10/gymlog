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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Logo from '../../assets/logo.png'
import { themas } from "../../global/themes";
import { Input } from '../../components/Input';

export default function Login (){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword,setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);

    function getLogin(){
        setLoading(true)
        try {
            if(!email || !password){
                return Alert.alert('Missing info', 'Please enter email and password.')
            }
            
            console.log('Logged in');

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
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
                
            <Input  
                value='email'
                onChangeText={setEmail}
                title='EMAIL ADDRESS'
                IconRigth={MaterialIcons}
                iconRigthName='email'

            />
            <Input  
                value='(password)'
                onChangeText={setPassword}
                title='PASSWORD'
                IconRigth={AntDesign}
                iconRigthName={showPassword?"eye-invisible":"eye"}
                secureTextEntry={showPassword}
                onIconRigthPress={()=> setShowPassword(!showPassword)}

            />

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
                