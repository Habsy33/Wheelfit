import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';

const ForgotPassword: React.FC = () => {

  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Select what method you’d like to reset.</Text>

      {/* Reset Options */}
      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="mail" size={24} color="#fff" style={styles.icon} />
        <View>
          <Text style={styles.optionTitle}>Send via Email</Text>
          <Text style={styles.optionSubtitle}>Seamlessly reset your password via email address.</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="shield" size={24} color="#fff" style={styles.icon} />
        <View>
          <Text style={styles.optionTitle}>Send via 2FA</Text>
          <Text style={styles.optionSubtitle}>Seamlessly reset your password via 2 Factors.</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="logo-google" size={24} color="#fff" style={styles.icon} />
        <View>
          <Text style={styles.optionTitle}>Send via Google Auth</Text>
          <Text style={styles.optionSubtitle}>Seamlessly reset your password via gAuth.</Text>
        </View>
      </TouchableOpacity>
      
      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={() => router.push('../expanded-pages/passwordSent')}>
        <Text style={styles.resetText}>Reset Password</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 130, marginTop:20, },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 10 },
  icon: { marginRight: 10 },
  optionTitle: { fontSize: 16, fontWeight: 'bold' },
  optionSubtitle: { fontSize: 12, color: '#666' },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4169E1', padding: 15, borderRadius: 10, marginTop: 20 },
  resetText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
});

export default ForgotPassword;
