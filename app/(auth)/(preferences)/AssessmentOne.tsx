import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { updatePreferences } from "@/utils/preferences"; // Import the updatePreferences function

const AssessmentOne: React.FC = () => {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    "I wanna lose weight",
    "To train with a community",
    "I wanna get bulks",
    "I wanna gain endurance",
    "Just trying out the app!",
  ];

  const handleContinue = async () => {
    if (selectedGoal) {
      await updatePreferences( "goal", selectedGoal);
    }
    router.push("../AssessmentTwo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingTitle}>WheelFit</Text>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.progress}>1 of 6</Text>
      <Text style={styles.question}>What's your fitness goal/target?</Text>
      <View style={styles.goalsContainer}>
        {goals.map((goal, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.goalButton,
              selectedGoal === goal && styles.selectedGoalButton,
            ]}
            onPress={() => setSelectedGoal(goal)}
          >
            <Text
              style={[
                styles.goalText,
                selectedGoal === goal && styles.selectedGoalText,
              ]}
            >
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push("/(tabs)")}>
        <Text style={styles.skipButtonText}>Skip Assessment</Text>
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
  headingTitle: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  progress: {
    fontSize: 20,
    marginBottom: 20,
    color: "#666",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  goalsContainer: {
    width: "100%",
    marginBottom: 30,
  },
  goalButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedGoalButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  goalText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGoalText: {
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
  skipButton: {
    marginTop: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default AssessmentOne;