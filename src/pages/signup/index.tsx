import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Logo from "../../assets/logo.png";
import { style } from "../login/style";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Alert.alert("Sign up failed", error.message);
        return;
      }
      Alert.alert("Success", "Account created! Please log in.");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Unexpected error, try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={style.container}>
        <View style={style.boxTop}>
          <Image source={Logo} style={style.logo} resizeMode="contain" />
          <Text style={style.text}>Create Account</Text>
        </View>

        <View style={[style.boxMid, { flex: 1 }]}>
          <Input
            value={email}
            onChangeText={setEmail}
            title="EMAIL"
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
            iconRigthName="lock"
            secureTextEntry
          />
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            title="CONFIRM PASSWORD"
            IconRigth={AntDesign}
            iconRigthName="lock"
            secureTextEntry
          />
        </View>

        <View style={{ padding: 20, width: "100%" }}>
          <Button text="Sign up" loading={loading} onPress={handleSignUp} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
