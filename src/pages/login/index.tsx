import React, { useState } from "react";

import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { style } from "./style";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Logo from "../../assets/logo.png";
import { themas } from "../../global/themes";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import BottomRoutes from "../../routes/bottom.routes";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  function getLogin() {
    setLoading(true);
    try {
      if (!email || !password) {
        return Alert.alert("Missing info", "Please enter email and password.");
      }

      navigation.reset({ routes: [{ name: "BottomRoutes" }] });

      console.log("Logged in");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.text}>Gym Log</Text>
      </View>

      <View style={style.boxMid}>
        <Input
          value={email}
          onChangeText={setEmail}
          title="EMAIL ADDRESS"
          IconRigth={MaterialIcons}
          iconRigthName="email"
        />
        <Input
          value={password}
          onChangeText={setPassword}
          title="PASSWORD"
          IconRigth={AntDesign}
          iconRigthName={showPassword ? "eye-invisible" : "eye"}
          secureTextEntry={showPassword}
          onIconRigthPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <View style={style.boxBottom}>
        <Button text="Log in" loading={loading} onPress={() => getLogin()} />
      </View>
      <Text style={style.textBottom}>
        Don’t have an account?{" "}
        <Text style={style.textBottomCreate}>Sign up here</Text>
      </Text>
    </View>
  );
}
