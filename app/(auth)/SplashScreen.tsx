import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from './AppNavigation';

const SplashScreen = () => {
  // const navigation = useNavigation();
  const navigation = useNavigation<AuthNavigationProp>(); 
  const fadeAnim = new Animated.Value(1); // Start fully visible

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("SplashScreenTwo"); 
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.centerContent}>
        <Image source={require("@/assets/images/wheelfit_logo.png")} style={styles.logo} />
        <Text style={styles.appName}>WheelFit</Text>
        <Text style={styles.subtitle}>Your inclusive fitness coach.</Text>
      </View>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4667AC", // Adjust to match your theme
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
});
