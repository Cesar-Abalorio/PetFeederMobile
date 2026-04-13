import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ImageBackground,
} from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as backendLogin } from "../services/api";
import { styles } from "../styles/LoginStyles";

// declare a root stack param list to get proper typing for navigation
type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  User: undefined;
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // suppress navigation typing, or provide your own route param list
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    // Admin login fallback
    if (username === "admin" && password === "1234") {
      await AsyncStorage.setItem("currentUser", "admin");
      await AsyncStorage.setItem("role", "admin");
      navigation.navigate("Dashboard");
      return;
    }

    try {
      await backendLogin(username, password);
      await AsyncStorage.setItem("role", "user");
      navigation.navigate("User");
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Invalid credentials");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Bg.png")}
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.loginCard}>
        <Image source={require("../assets/Logo.png")} style={styles.logo} />
        <Text style={styles.title}>Log in to your Account</Text>

        <View style={styles.usernameWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.toggle}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rememberRow}>
            <Switch value={remember} onValueChange={setRemember} />
            <Text style={styles.rememberText}>Remember</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}> 
          <Text style={styles.create}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


