import { useNavigation, type NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/SignupStyles";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  User: undefined;
};

export default function Signup() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
	/* Backgrund */
    <ImageBackground source={require("../assets/Bg.png")} 
	style={styles.backgroundImage}>

      {/* Main container */}
      <View style={styles.container}>
        <View style={styles.signupCard}>

          {/* Logo */}
          <Image
            source={require("../assets/Logo.png")} 
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>

          {/* Input fields */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}