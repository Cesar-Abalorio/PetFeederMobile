import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (pass: string) => {
    setPassword(pass);

    if (pass.length < 6) {
      setPasswordStrength("Weak");
    } else if (
      pass.length >= 6 &&
      (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass))
    ) {
      setPasswordStrength("Medium");
    } else if (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[!@#$%^&*]/.test(pass)
    ) {
      setPasswordStrength("Strong");
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    const usersJson = await AsyncStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      Alert.alert("Email already registered.");
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    await AsyncStorage.setItem("users", JSON.stringify(users));

    Alert.alert("Account created successfully!", "Please log in.");
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../assets/Bg.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.signupCard}>
              <Image
                source={require("../assets/Logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.title}>Create Account</Text>

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
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={checkPasswordStrength}
                />

                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Password Strength */}
              {password !== "" && (
                <Text
                  style={{
                    marginBottom: 10,
                    fontWeight: "600",
                    color:
                      passwordStrength === "Weak"
                        ? "red"
                        : passwordStrength === "Medium"
                          ? "orange"
                          : "green",
                  }}
                >
                  Strength: {passwordStrength}
                </Text>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.showText}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
