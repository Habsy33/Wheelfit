import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const AssessmentSplashScreen: React.FC = () => {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => setShowInitialMessage(false));
  }, []);

  return (
    <View style={styles.container}>
      {showInitialMessage ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.fadeMessage}>Just a sec, {'\n'} we're signing you in...</Text>
        </Animated.View>
      ) : (
        <View style={styles.mainContent}>
          <Text style={styles.header}>WheelFit</Text>
          <Text style={styles.subText}>We’re going to ask you a few questions {'\n'} to tailor this app to your needs..</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('../AssessmentOne')}>
            <Text style={styles.buttonText}>Let's get started →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.secondaryButtonText}>I'll skip for now (not recommended)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fadeMessage: {
    fontSize: 32,
    color: '#555',
    fontWeight: 'bold',
  },
  mainContent: {
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#005CEE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#005CEE',
    fontSize: 14,
  },
});

export default AssessmentSplashScreen;
