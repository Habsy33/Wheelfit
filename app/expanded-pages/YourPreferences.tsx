import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Header } from '@/components/Header';
import { getPreferences } from '@/utils/preferences'; 
import { auth } from '@/firebaseConfig'; 

const YourPreferences = () => {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<{
    goal: string | null;
    gender: string | null;
    limitation: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    preference: string | null;
  } | null>(null);

  // Fetch the user's preferences from Firebase
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('No authenticated user found');
          return;
        }

        const userPreferences = await getPreferences();
        setPreferences(userPreferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="WheelFit" streak="28/30" subtitle="Adaptive Home Workouts" />

      <Text style={styles.title}>Your Preferences</Text>

      {/* Display Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitness Goal</Text>
        <Text style={styles.preferenceText}>
          {preferences?.goal || 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <Text style={styles.preferenceText}>
          {preferences?.gender || 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Limitation</Text>
        <Text style={styles.preferenceText}>
          {preferences?.limitation || 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age</Text>
        <Text style={styles.preferenceText}>
          {preferences?.age || 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <Text style={styles.preferenceText}>
          {preferences?.weight ? `${preferences.weight}` : 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Height</Text>
        <Text style={styles.preferenceText}>
          {preferences?.height ? `${preferences.height}` : 'Not set'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preference</Text>
        <Text style={styles.preferenceText}>
          {preferences?.preference || 'Not set'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 1,
    marginTop: -40,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  preferenceText: {
    fontSize: 16,
    color: '#333',
  },
});

export default YourPreferences;