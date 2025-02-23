import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';


const FeaturedEvents = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { title, duration, level, image, description, equipment, intensity } = useLocalSearchParams(); 

  return (
    <View style={{ flex: 1, backgroundColor: '#1a202c', paddingBottom: 20 }}>
      {/* Header Component */}
      <View style={styles.featuredHeader}>
      <Header title="WheelFit" streak="28/30" subtitle={Array.isArray(title) ? title[0] : title || "Adaptive Strength Workout"} />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Image
          source={image ? { uri: image } : require('@/assets/images/wheelfit_background.png')}
          style={styles.heroImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.workoutTitle}>{title || "Featured Events"}</Text>
          <Text style={styles.workoutDescription}>
            {duration ? `${duration} • ${level}` : "Build core strength, improve mobility, and stay active."}
          </Text>
        </View>
      </View>

      {/* Workout Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.sectionText}>{description || "A 4-week fitness plan designed for wheelchair users, focusing on upper body strength, endurance, and core stability. No gym required!"}</Text>
      </View>

      {/* Program Details */}
      <View style={styles.programDetailsContainer}>
        <Text style={styles.sectionTitle}>Program Details</Text>
        {[ 
          equipment ? `Equipment: ${equipment}` : 'Equipment optional (Resistance bands, weights)',
          duration ? `Duration: ${duration}` : '8-27 mins / day',
          level ? `Intensity: ${level}` : 'Wheelchair-accessible workouts',
          intensity ? `Workout Intensity: ${intensity}` : null,
        ].filter(Boolean).map((detail, index) => (
          <View key={index} style={styles.programDetailItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.programDetailText}>{detail}</Text>
          </View>
        ))}
      </View>

      {/* Start Workout Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton}
        onPress={() => router.push('../expanded-pages/SplashScreenThree')}>
          <Text style={styles.startButtonText}>I'm Going!</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});

export default FeaturedEvents;
