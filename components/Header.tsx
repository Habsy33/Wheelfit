import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface HeaderProps {
  streak: string; // Example: "28/30"
  title: string; // Example: "WheelFit"
  subtitle: string; // Example: "Adaptive Home Workouts"
}

export const Header: React.FC<HeaderProps> = ({ streak, title, subtitle }) => {
  return (
    <SafeAreaView style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.logoText}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.streakContainer}>
          <FontAwesome5 name="fire" size={24} color="#FF4500" />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#406DC6', // Customizable background color
    borderRadius: 20, // Adds rounded corners
    overflow: 'hidden', // Ensures content respects the borderRadius
    marginHorizontal: -2, // Adds some spacing on the sides
  },
  headerContainer: {
    marginTop: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16, // Controls inner spacing
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#D3D3D3',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#FF4500',
    fontWeight: 'bold',
  },
});
