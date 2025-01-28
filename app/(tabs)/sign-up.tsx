import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const SignUp: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
    } else {
      setErrorMessage('');
      // Add sign-up logic here
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up For Free</Text>
        <Text style={styles.subtitle}>Quickly make your account in 1 minute</Text>
      </View>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize="words"
          placeholder="Full Name"
          placeholderTextColor="#999"
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email Address"
          placeholderTextColor="#999"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="#999"
          onChangeText={setPassword}
        />
        <TouchableOpacity>
          <Ionicons name="eye" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity>
          <Ionicons name="eye" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005CEE',
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#005CEE',
    fontWeight: 'bold',
  },
});

export default SignUp;
