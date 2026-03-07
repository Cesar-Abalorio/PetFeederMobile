import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  signupCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10,
    alignItems: "center",
  },

  title: {
    marginBottom: 25,
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },

  inputWrapper: {
    width: "100%",
    marginBottom: 16,
  },

  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#2aa8a1",
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },

  button: {
    backgroundColor: "#2aa8a1",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },

  link: {
    marginTop: 20,
    color: "#2aa8a1",
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 35,
    borderRadius: 10,
    resizeMode: "cover",
  },
});