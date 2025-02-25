import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';


const AssessmentFive: React.FC = () => {

  const router = useRouter();  
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [height, setHeight] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={styles.subtitle}>5 of 6</Text>
      <Text style={styles.question}>What is your weight?</Text>
      <View style={styles.unitContainer}>
        <TouchableOpacity
          style={[
            styles.unitButton,
            weightUnit === "kg" && styles.selectedUnitButton,
          ]}
          onPress={() => setWeightUnit("kg")}
        >
          <Text
            style={[
              styles.unitText,
              weightUnit === "kg" && styles.selectedUnitText,
            ]}
          >
            kg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.unitButton,
            weightUnit === "lbs" && styles.selectedUnitButton,
          ]}
          onPress={() => setWeightUnit("lbs")}
        >
          <Text
            style={[
              styles.unitText,
              weightUnit === "lbs" && styles.selectedUnitText,
            ]}
          >
            lbs
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="128"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <Text style={styles.question}>What is your height?</Text>
      <View style={styles.unitContainer}>
        <TouchableOpacity
          style={[
            styles.unitButton,
            heightUnit === "cm" && styles.selectedUnitButton,
          ]}
          onPress={() => setHeightUnit("cm")}
        >
          <Text
            style={[
              styles.unitText,
              heightUnit === "cm" && styles.selectedUnitText,
            ]}
          >
            cm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.unitButton,
            heightUnit === "ft" && styles.selectedUnitButton,
          ]}
          onPress={() => setHeightUnit("ft")}
        >
          <Text
            style={[
              styles.unitText,
              heightUnit === "ft" && styles.selectedUnitText,
            ]}
          >
            ft
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="170"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.continueButton} onPress={() => router.push('../AssessmentSix')}>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
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