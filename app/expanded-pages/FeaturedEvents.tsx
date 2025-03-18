// FeaturedEvents.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { trackEventSignUp } from '@/utils/eventsTracking'; // Import the utility function

const FeaturedEvents = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { title, date, description, image } = useLocalSearchParams();

  const handleSignUp = async () => {
    if (!title || !description) {
      console.error("Missing required event details");
      return;
    }

    try {
      await trackEventSignUp(
        Array.isArray(title) ? title[0] : title,
        Array.isArray(date) ? date[0] : date || "No date provided",
        Array.isArray(description) ? description[0] : description
      );
      console.log("Event sign-up successful!");
      router.push('../expanded-pages/SplashScreenThree');
    } catch (error) {
      console.error("Error signing up for event:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1a202c', paddingBottom: 20 }}>
      {/* Header Component */}
      <View style={styles.featuredHeader}>
        <Header title="WheelFit" subtitle={Array.isArray(title) ? title[0] : title || "Adaptive Strength Workout"} />
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
          source={image ? { uri: image } : require('@/assets/images/group_fitness.jpg')}
          style={styles.heroImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.workoutTitle}>{title || "Featured Events"}</Text>
          <Text style={styles.workoutDescription}>
            {date ? `Date: ${date}` : "Build core strength, improve mobility, and stay active."}
          </Text>
        </View>
      </View>

      {/* Workout Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.sectionText}>{description || "Ella’s friendly, engaging and knowledgeable style has made her a firm favourite with the disabled community throughout the UK. No gym required!"}</Text>
      </View>

      {/* Start Workout Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleSignUp}>
          <Text style={styles.startButtonText}>Sign Me Up!</Text>
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