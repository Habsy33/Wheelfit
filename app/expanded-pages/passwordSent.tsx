import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PasswordSent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Sent!</Text>
      <Text style={styles.subtitle}>
        We've sent the password to <Text style={styles.email}>*22fb@gmail.com</Text>. Resend if the password is not received!
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Re-Send Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  email: {
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PasswordSent;