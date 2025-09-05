import React, { forwardRef,LegacyRef } from "react";
import { View,Text,TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { styles } from "../style";
import { themas } from "../../global/themes";
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> | 
                     React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
                     React.ComponentType<React.ComponentProps<typeof AntDesign>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRigth?: IconComponent,
    iconLeftName?: string,
    iconRigthName?: string,
    title?: string,
    onIconLeftPress?: () => void,
    onIconRigthPress?: () => void,

}

export const Input = forwardRef ((Props:Props,ref: LegacyRef<TextInput> | null)=>{

    const {IconLeft, IconRigth, iconLeftName, iconRigthName, title, onIconLeftPress, onIconRigthPress, ...rest} = Props

    const calculateSizeWidth = () =>{
        if(IconLeft && IconRigth){
            return '80%'
        } else if (IconLeft || IconRigth ){
            return '90%'
        } else {
            return '100%'
        }
}

    const calculateSizePaddingLeft = () =>{
        if(IconLeft && IconRigth){
            return 0;
        } else if (IconLeft || IconRigth ){
            return 10;
        } else {
            return 20;
        }
    }

    return (
        <>
        {title&&<Text style={styles.titleInput}>{title}</Text>}
            <View style={[styles.boxInput,{paddingLeft:calculateSizePaddingLeft()}]}>
                {IconLeft && iconLeftName && (
                <TouchableOpacity onPress={onIconLeftPress} style={styles.Button}>
                    <IconLeft name={iconLeftName as any} size={20} color={themas.colors.gray} style={styles.Icon}/>
                </TouchableOpacity>
                )}
            <TextInput 
            style={[styles.input,{width:calculateSizeWidth()}]}
            {...rest} 
            />
                {IconRigth && iconRigthName && (
                <TouchableOpacity onPress={onIconRigthPress} style={styles.Button}>
                    <IconRigth name={iconRigthName as any} size={20} color={themas.colors.gray} style={styles.Icon}/>
                </TouchableOpacity>
                )}
            </View>
        </>
    )
})