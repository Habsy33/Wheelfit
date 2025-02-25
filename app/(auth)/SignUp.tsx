import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, ref, set, get } from "@/firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './AppNavigation';

const SignUp: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>(); 
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSignUp = async () => {
    try {
      if (!email || !username || !password || !confirmPassword || !fullName) {
        setErrorMessage("Please fill in all fields.");
        return;
      }
  
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
  
      // Check if username is already taken
      const usernameRef = ref(db, `usernames/${username}`);
      const snapshot = await get(usernameRef);
  
      if (snapshot.exists()) {
        setErrorMessage("Username already taken. Choose another.");
        return;
      }
  
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userCredential.user);
  
      const userId = userCredential.user.uid;
  
      // Store user details in Realtime Database
      const userRef = ref(db, `users/${userId}`);
      await set(userRef, {
        fullName,
        username,
        email,
        createdAt: new Date().toISOString(),
      });
  
      // Store username to prevent duplicates
      const usernameRefToSet = ref(db, `usernames/${username}`);
      await set(usernameRefToSet, { userId });
  
      // Redirect user to another authentication page (e.g., email verification)
      router.push("/(auth)/(preferences)/AssessmentSplashScreen");
  
    } catch (error: any) {
      console.error("Error signing up:", error);
  
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered. Try logging in instead.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('SignIn')}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up For Free</Text>
        <Text style={styles.subtitle}>Quickly make your account in 1 minute</Text>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize="words"
          placeholder="Full Name"
          placeholderTextColor="#999"
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="at" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor="#999"
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email Address"
          placeholderTextColor="#999"
          onChangeText={setEmail}
        />
      </View>
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
      </View>
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
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
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
