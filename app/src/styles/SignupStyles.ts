import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  signupCard: {
    width: width > 600 ? 400 : "100%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // ---------- INPUT WRAPPER & SHOW BUTTON ----------
  inputWrapper: {
    width: "100%",
    marginBottom: 15,
    position: "relative", // important para ma-position ang Show/Hide button
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    paddingRight: 60, // space para sa Show/Hide button
    borderRadius: 8,
  },

  showButton: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  showText: {
    color: "#2aa8a1",
    fontWeight: "600",
  },

  button: {
    width: "100%",
    backgroundColor: "#2aa8a1",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  link: {
    marginTop: 15,
    color: "#2aa8a1",
  },
});
