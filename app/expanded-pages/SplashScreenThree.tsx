import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SplashScreenThree = () => {
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.push('../(tabs)/near-you'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>  
        <Ionicons name="checkmark-circle" size={60} color="white" />
        <Text style={styles.text}>Great You've Signed Up!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c',
  },
  messageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default SplashScreenThree;
