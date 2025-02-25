import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';

const AssessmentFive: React.FC = () => {

  const router = useRouter();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [height, setHeight] = useState<string>("");

  const preferences = [
    "Jogging", "Walking", "Hiking", "Skating", "Biking", 
    "Weightlift", "Cardio", "Yoga", "Other"
  ];

  const togglePreference = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.subtitle}>6 of 6</Text>
      <Text style={styles.question}>Do you have a specific Exercise Preference?</Text>
      <View style={styles.preferencesContainer}>
        {preferences.map((preference, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.preferenceButton,
              selectedPreferences.includes(preference) && styles.selectedPreferenceButton,
            ]}
            onPress={() => togglePreference(preference)}
          >
            <Text
              style={[
                styles.preferenceText,
                selectedPreferences.includes(preference) && styles.selectedPreferenceText,
              ]}
            >
              {preference}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/(auth)/SignIn')}
      // change the destination of the button to the index, since this will take
      // place after the user has created an account already
            >
        <Text style={styles.continueButtonText}>Finish Preferences Setup! →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  preferenceButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedPreferenceButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  preferenceText: {
    fontSize: 16,
    color: "#333",
  },
  selectedPreferenceText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  unitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  unitButton: {
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedUnitButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  unitText: {
    fontSize: 16,
    color: "#333",
  },
  selectedUnitText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AssessmentFive;