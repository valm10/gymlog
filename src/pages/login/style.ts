import { Dimensions, StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop: {
        width:'100%',
        height:Dimensions.get('window').height/3,
        //backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center'
    },
    boxMid: {
        width:'100%',
        height:Dimensions.get('window').height/4,
        //backgroundColor:'green',
        paddingHorizontal:37
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
        marginTop: 40,
        fontSize:18
    },
    titleInput: {
        marginLeft:5,
        color:themas.colors.gray,
        marginTop:20
    },
    boxInput:{
        width:'100%',
        height:40,
        borderWidth:1,
        borderRadius:40,
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 5,
        backgroundColor: themas.colors.lightGray

    },
    input: {
        height: '100%',
        width: '90%',
        borderRadius:40,
        //backgroundColor:'red'
    }
})