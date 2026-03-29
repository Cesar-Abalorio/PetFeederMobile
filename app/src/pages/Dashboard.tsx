import { ImageBackground, StyleSheet, Text } from "react-native";

export default function Dashboard() {
  return (
    <ImageBackground
      source={require("../assets/Bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Dashboard</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});