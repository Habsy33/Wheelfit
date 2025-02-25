import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { updatePreferences } from "@/utils/preferences"; // Import the updatePreferences function

const AssessmentThree: React.FC = () => {
  const router = useRouter();
  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);

  const limitations = ["Arthritis", "Back Pain", "Asthma", "Obesity", "Knee Pain"];

  const toggleLimitation = (limitation: string) => {
    if (selectedLimitations.includes(limitation)) {
      setSelectedLimitations(selectedLimitations.filter((item) => item !== limitation));
    } else {
      setSelectedLimitations([...selectedLimitations, limitation]);
    }
  };

  const handleContinue = async () => {
    if (selectedLimitations.length > 0) {
      await updatePreferences("limitation", selectedLimitations.join(", "));
    }
    router.push("../AssessmentFour");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.progress}>3 of 6</Text>
      <Text style={styles.question}>Do you have any physical limitations?</Text>
      <View style={styles.limitationsContainer}>
        {limitations.map((limitation, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.limitationButton,
              selectedLimitations.includes(limitation) && styles.selectedLimitationButton,
            ]}
            onPress={() => toggleLimitation(limitation)}
          >
            <Text
              style={[
                styles.limitationText,
                selectedLimitations.includes(limitation) && styles.selectedLimitationText,
              ]}
            >
              {limitation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.mostCommon}>Most Common</Text>
      <View style={styles.commonLimitations}>
        <Text style={styles.commonLimitation}>Knee Pain X</Text>
        <Text style={styles.commonLimitation}>Muscle Pain X</Text>
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
  limitationsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  limitationButton: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  selectedLimitationButton: {
    borderColor: "#007bff",
    backgroundColor: "#e6f2ff",
  },
  limitationText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLimitationText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  mostCommon: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  commonLimitations: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  commonLimitation: {
    fontSize: 16,
    color: "#666",
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

export default AssessmentThree;