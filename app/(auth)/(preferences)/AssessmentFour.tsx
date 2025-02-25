import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';


const AssessmentFour: React.FC = () => {
  const router = useRouter();  
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const ages = ["16", "18", "19", "20"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.progress}>4 of 6</Text>
      <Text style={styles.question}>What is your age?</Text>
      <View style={styles.agesContainer}>
        {ages.map((age, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.ageButton,
              selectedAge === age && styles.selectedAgeButton,
            ]}
            onPress={() => setSelectedAge(age)}
          >
            <Text
              style={[
                styles.ageText,
                selectedAge === age && styles.selectedAgeText,
              ]}
            >
              {age}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push('../AssessmentFive')}>
        <Text style={styles.continueButtonText}>Continue</Text>
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
  progress: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  agesContainer: {
    width: "100%",
    marginBottom: 30,
  },
  ageButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedAgeButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  ageText: {
    fontSize: 16,
    color: "#333",
  },
  selectedAgeText: {
    color: "#007bff",
    fontWeight: "bold",
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

export default AssessmentFour;