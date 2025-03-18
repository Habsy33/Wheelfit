import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getAdaptiveExercisesByBodyPart, Exercise } from "@/utils/exerciseDb";
import { Header } from '@/components/Header'; // Import the Header component
import { useRouter } from "expo-router"; // Import useRouter for navigation
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for the back button

const FitnessGuides: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const bodyPart = "upper arms" // Change this to fetch different exercises
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await getAdaptiveExercisesByBodyPart(bodyPart);
      setExercises(data);
    };

    fetchExercises();
  }, []);

  // Handle exercise press
  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: "/expanded-pages/exerciseDetail",
      params: { exercise: JSON.stringify(exercise) }, // Pass the exercise as a JSON string
    });
  };

  // Truncate instructions for display
  const truncateInstructions = (instructions: string[], maxLength: number): string => {
    const combinedInstructions = instructions.join(" ");
    return combinedInstructions.length > maxLength
      ? combinedInstructions.substring(0, maxLength) + "..."
      : combinedInstructions;
  };

  return (
    <View style={styles.container}>
      {/* Add the Header component */}
      <Header title="WheelFit Fitness Guides" subtitle="Adaptive Fitness Exercises" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(tabs)")}>
        <Ionicons name="arrow-back" size={24} color="#005CEE" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Wheelchair-Friendly {bodyPart} Exercises</Text>
      <Text style={styles.subtitle}>
        These fitness guides are curated by our very own fitness specialists, freely adapt these to your liking, as these fitness guides serve as a framework to get you started on your fitness journey. Enjoy!   
      </Text>

      <Text style={styles.boldSubtitle}>
      Disclaimer: Some exercises might mention standing but can still be performed whilst sitting down.
      </Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleExercisePress(item)}>
            <View style={styles.card}>
              <Image source={{ uri: item.gifUrl }} style={styles.image} />
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.bodyPart}>Target: {item.target}</Text>
              <Text style={styles.equipment}>Equipment: {item.equipment}</Text>
              <Text style={styles.instructions}>
                {truncateInstructions(item.instructions, 100)} {/* Truncate instructions */}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: "#fff",
    marginTop: -50, // Adjust this value to position the Header correctly
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10, // Adjust this value to position the title correctly below the Header
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  boldSubtitle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: 'bold',
    padding: 20,
  },
  card: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  bodyPart: {
    fontSize: 14,
    color: "gray",
  },
  equipment: {
    fontSize: 14,
    fontStyle: "italic",
    color: "gray",
  },
  instructions: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#005CEE",
    marginLeft: 5,
  },
});

export default FitnessGuides;