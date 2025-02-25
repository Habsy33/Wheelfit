import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { updatePreferences } from "@/utils/preferences"; // Import the updatePreferences function

const AssessmentTwo: React.FC = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genders = ["Male", "Female", "Prefer to skip, thanks!"];

  const handleContinue = async () => {
    if (selectedGender) {
      await updatePreferences("gender", selectedGender);
    }
    router.push("../AssessmentThree");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.progress}>2 of 6</Text>
      <Text style={styles.question}>What is your gender?</Text>
      <View style={styles.gendersContainer}>
        {genders.map((gender, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.genderButton,
              selectedGender === gender && styles.selectedGenderButton,
            ]}
            onPress={() => setSelectedGender(gender)}
          >
            <Text
              style={[
                styles.genderText,
                selectedGender === gender && styles.selectedGenderText,
              ]}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  gendersContainer: {
    width: "100%",
    marginBottom: 30,
  },
  genderButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedGenderButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGenderText: {
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

export default AssessmentTwo;