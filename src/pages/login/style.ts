import { Dimensions, StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        padding:20,
        justifyContent:'center'
    },
    boxTop: {
        width:'100%',
        height:Dimensions.get('window').height/3,
        backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center'
    },
    boxMid: {
        width:'100%',
        height:Dimensions.get('window').height/4,
        backgroundColor:'green'
    },
    boxBottom: {
        width:'100%',
        height:Dimensions.get('window').height/3,
        backgroundColor:'red'
    },
    logo: {
        width:80,
        height:80,
        borderRadius:5
    },
    text: {
        fontWeight: 'bold',
        marginTop: 40
    }
})