import React, { useState } from "react";
import { Text, View, Image, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Logo from "../../assets/logo.png";
import { style } from "./style";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../routes/types";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Missing info", "Please enter email and password.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }
      // let Routes handle stack switch via auth listener
    } catch {
      Alert.alert("Error", "Unexpected error, try again.");
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
          keyboardType="email-address"
          autoCapitalize="none"
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
        <Button text="Log in" loading={loading} onPress={getLogin} />
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={style.textBottom}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={style.textBottomCreate}>Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
