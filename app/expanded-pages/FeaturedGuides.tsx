import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

const FeaturedGuides = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  // Parse the exercises array from the JSON string
  const exercises = params.exercises ? JSON.parse(params.exercises as string) : [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a202c' }}>
      {/* Header Component */}
      <View style={styles.featuredHeader}>
        <Header 
          title="WheelFit"  
          subtitle={Array.isArray(params.title) ? params.title[0] : params.title || "Adaptive Strength Workout"} 
        />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Image
            source={params.image ? { uri: params.image as string } : require('@/assets/images/wheelchairguy1.jpg')}
            style={styles.heroImage}
          />
          <Text style={styles.workoutTitle}>{params.title || "Adaptive Strength Workout"}</Text>
          <Text style={styles.workoutDescription}>
            {params.duration ? `${params.duration} • ${params.level}` : "Build core strength, improve mobility, and stay active."}
          </Text>
        </View>
      </View>

      {/* Workout Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About This Workout</Text>
        <Text style={styles.sectionText}>
          {params.description || "A 4-week fitness plan designed for wheelchair users, focusing on upper body strength, endurance, and core stability. No gym required!"}
        </Text>
      </View>

      {/* Program Details */}
      <View style={styles.programDetailsContainer}>
        <Text style={styles.sectionTitle}>Program Details</Text>
        {[ 
          params.equipment ? `Equipment: ${params.equipment}` : 'Equipment optional (Resistance bands, weights)',
          params.duration ? `Duration: ${params.duration}` : '8-27 mins / day',
          params.level ? `Intensity: ${params.level}` : 'Wheelchair-accessible workouts',
          params.intensity ? `Workout Intensity: ${params.intensity}` : null,
        ].filter(Boolean).map((detail, index) => (
          <View key={index} style={styles.programDetailItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.programDetailText}>{detail}</Text>
          </View>
        ))}
      </View>

      {/* Exercises List */}
      <View style={styles.exercisesContainer}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exercises.map((exercise: string, index: number) => (
          <View key={index} style={styles.exerciseItem}>
            <View style={styles.exerciseNumber}>
              <Text style={styles.exerciseNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.exerciseText}>{exercise}</Text>
          </View>
        ))}
      </View>

      {/* Start Workout Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('../expanded-pages/SplashScreenFour')}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  featuredHeader: {
    marginTop: -60,
  },
  heroSection: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    backgroundColor: 'rgba(232, 58, 58, 0.23)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  workoutDescription: {
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  sectionText: {
    color: '#a0aec0',
  },
  programDetailsContainer: {
    paddingHorizontal: 16,
  },
  programDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 20,
    height: 20,
    backgroundColor: '#4299e1',
    borderRadius: 10,
    marginRight: 8,
  },
  programDetailText: {
    color: 'white',
  },
  startButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: '#4299e1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesContainer: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1a202c',
    padding: 12,
    borderRadius: 8,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#4299e1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
});

export default FeaturedGuides;
