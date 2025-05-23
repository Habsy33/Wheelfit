import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './AppNavigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, ref, get, update } from "@/firebaseConfig";


const SignIn: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleSignIn = async () => {
    setErrorMessage(""); // Clear previous error messages
  
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);

      // Check if user has seen the tour
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // If hasSeenTour is not set, set it to true
        if (!userData.hasSeenTour) {
          await update(userRef, { hasSeenTour: true });
        }
      }
  
      // Navigate to the main app with a parameter indicating sign in origin
      navigation.reset({
        index: 0,
        routes: [{ 
          name: "(tabs)" as never,
          params: { fromSignIn: true }
        }],
      });
  
    } catch (error: any) {
      console.error("Sign-in error:", error);
  
      // Handle Firebase Auth errors
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect email or password. Try again or reset your password.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many failed attempts. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('SplashScreenTwo')}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign In To WheelFit</Text>
        <Text style={styles.subtitle}>Let's personalize your fitness journey</Text>
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
          value={email}
          onChangeText={setEmail}
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
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Social Media Icons */}
      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="instagram" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="linkedin" size={20} color="#000" />
        </TouchableOpacity>
      </View>

       {/* Footer */}
       <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password</Text>
        </TouchableOpacity>
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
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
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
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005CEE',
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    marginHorizontal: 10,
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

export default SignIn;