import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header } from '@/components/Header'; // Importing the Header component

const Settings: React.FC = () => {
  const dailyStreak = 28; // Example streak value

  return (
    <View style={styles.wrapper}>
      {/* Header Component */}
      <Header 
        streak={`${dailyStreak}/30`} 
        title="WheelFit" 
        subtitle="Adaptive Home Workouts" 
      />

      <ScrollView style={styles.container}>
        {/* Workout Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Workout Settings</Text>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>General Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Apple Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        {/* Support Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support us</Text>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>More Apps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Rate Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Version Information */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.31.1</Text>
        </View>

        {/* Additional Information */}
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoText}>
            100pcs 19 Sizes Aluminum Blin... 5/32"x1/2"(4mm*12.7mm) Major Material: Aluminum...
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F1F0F0', // Match the app background
    marginTop: -60, // Adjust based on your header height
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F0F0',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfo: {
    alignItems: 'center',
  },
  additionalInfoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default Settings;