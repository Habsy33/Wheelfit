import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Header } from '@/components/Header'; // Import the Header component

// Define the Preferences interface
interface Preferences {
  fitnessGoal: string;
  workoutType: string[];
  intensityLevel: string;
  sessionDuration: string;
  communityTab: boolean;
  healthAlerts: string;
  workoutReminders: boolean;
  pushNotifications: boolean;
}

// Validation schema using Yup
const PreferencesSchema = Yup.object().shape({
  fitnessGoal: Yup.string().required('Fitness goal is required'),
  workoutType: Yup.array().min(1, 'Select at least one workout type'),
  intensityLevel: Yup.string().required('Intensity level is required'),
  sessionDuration: Yup.string().required('Session duration is required'),
  healthAlerts: Yup.string().optional(),
});

export default function YourPreferences() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: Preferences) => {
    setLoading(true);
    console.log("Saved Preferences:", data);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Header title="WheelFit" streak="28/30" subtitle="Adaptive Home Workouts" />

        <Text style={styles.title}>Your Preferences</Text>
        <Formik
          initialValues={{
            fitnessGoal: '',
            workoutType: [],
            intensityLevel: '',
            sessionDuration: '',
            communityTab: false,
            healthAlerts: '',
            workoutReminders: false,
            pushNotifications: false,
          }}
          validationSchema={PreferencesSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
            <View>
              {/* Fitness Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fitness & Activity Preferences</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Fitness Goal"
                  onChangeText={handleChange('fitnessGoal')}
                  onBlur={handleBlur('fitnessGoal')}
                  value={values.fitnessGoal}
                />
                {touched.fitnessGoal && errors.fitnessGoal && (
                  <Text style={styles.errorText}>{errors.fitnessGoal}</Text>
                )}
              </View>

              {/* Community Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Community & Social Preferences</Text>
                <View style={styles.switchContainer}>
                  <Text>Enable Community Tab</Text>
                  <Switch
                    value={values.communityTab}
                    onValueChange={(value: boolean) => {
                      setFieldValue('communityTab', value).then(() => {
                        // Optional: Add any additional logic here if needed
                      });
                    }}
                  />
                </View>
              </View>

              {/* Health & Safety Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health & Safety Preferences</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Health Alerts (e.g., Pressure sores)"
                  onChangeText={handleChange('healthAlerts')}
                  onBlur={handleBlur('healthAlerts')}
                  value={values.healthAlerts}
                />
                <View style={styles.switchContainer}>
                  <Text>Workout Reminders</Text>
                  <Switch
                    value={values.workoutReminders}
                    onValueChange={(value: boolean) => {
                      setFieldValue('workoutReminders', value).then(() => {
                        // Optional: Add any additional logic here if needed
                      });
                    }}
                  />
                </View>
              </View>

              {/* Notifications Preferences */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications & App Settings</Text>
                <View style={styles.switchContainer}>
                  <Text>Push Notifications</Text>
                  <Switch
                    value={values.pushNotifications}
                    onValueChange={(value: boolean) => {
                      setFieldValue('pushNotifications', value).then(() => {
                        // Optional: Add any additional logic here if needed
                      });
                    }}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()} // Wrap handleSubmit to ignore the event argument
              >
                <Text style={styles.buttonText}>{loading ? "Saving..." : "Save Preferences"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F1F0F0', // Match the background color from index.tsx
    marginTop: -60,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});