import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useRouter for navigation
import { Exercise } from "@/utils/exerciseDb";
import { Header } from '@/components/Header'; // Import the Header component
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for the back button
import { saveExerciseTracking } from "@/utils/fitnessTracker"; // Import the fitness tracking utility
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const ExerciseDetail: React.FC = () => {
  const { exercise } = useLocalSearchParams<{ exercise: string }>();
  const selectedExercise: Exercise = JSON.parse(exercise); // Parse the exercise object
  const router = useRouter(); // Initialize the router
  const YOUTUBE_API_KEY = Constants.expoConfig?.extra?.youtubeApiKey;

  // State for splash screen and rating page
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRatingPage, setShowRatingPage] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1)); // For fade animation

  // State for ratings
  const [detailRating, setDetailRating] = useState(0);
  const [easeRating, setEaseRating] = useState(0);

  // State for YouTube video
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Fetch YouTube video when component mounts
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const searchQuery = `${selectedExercise.name} wheelchair`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
            searchQuery
          )}&type=video&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch video from YouTube API.');
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId);
        } else {
          // If no results found, try a more general wheelchair exercise search
          const fallbackQuery = `${selectedExercise.name} wheelchair exercise`;
          const fallbackResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
              fallbackQuery
            )}&type=video&key=${YOUTUBE_API_KEY}`
          );
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.items && fallbackData.items.length > 0) {
              setVideoId(fallbackData.items[0].id.videoId);
            } else {
              setVideoError('No video guide found.');
            }
          } else {
            setVideoError('Failed to load video guide.');
          }
        }
      } catch (error) {
        console.error('Error fetching YouTube video:', error);
        setVideoError('Failed to load video guide.');
      } finally {
        setIsLoadingVideo(false);
      }
    };

    fetchVideo();
  }, [selectedExercise.name]);

  // Handle Exercise Finished button press
  const handleExerciseFinished = () => {
    setShowConfirmation(true);

    // Fade out the confirmation message after 2 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setShowConfirmation(false);
      setShowRatingPage(true); // Show the rating page
    });
  };

// Handle rating submission
const handleRatingSubmit = async () => {
    // Prepare the exercise tracking data
    const exerciseTrackingData = {
      username: "", // Will be populated by saveExerciseTracking
      userId: "", // Will be populated by saveExerciseTracking
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      bodyPart: selectedExercise.bodyPart,
      target: selectedExercise.target,
      equipment: selectedExercise.equipment,
      detailRating,
      easeRating,
      timestamp: Date.now(),
    };
  
    // Save the exercise tracking data to Firebase
    await saveExerciseTracking(exerciseTrackingData);
  
    // Redirect to /(tabs)
    router.replace("/(tabs)");
  };

  // Custom Star Rating Component
  const StarRating = ({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onRate(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={30}
              color={star <= rating ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add the Header component */}
      <Header title="WheelFit Fitness Guides" subtitle="Adaptive Fitness Exercises" />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Main Content */}
      {!showConfirmation && !showRatingPage ? (
        <ScrollView style={styles.scrollContainer}>
          <Image source={{ uri: selectedExercise.gifUrl }} style={styles.image} />
          <Text style={styles.title}>{selectedExercise.name}</Text>
          <Text style={styles.detail}>Target: {selectedExercise.target}</Text>
          <Text style={styles.detail}>Equipment: {selectedExercise.equipment}</Text>
          <Text style={styles.detail}>Body Part: {selectedExercise.bodyPart}</Text>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          {selectedExercise.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instruction}>
              {`${index + 1}. ${instruction}`}
            </Text>
          ))}

          {/* YouTube Video Guide Section */}
          <View style={styles.videoSection}>
            <Text style={styles.videoTitle}>Video Guide</Text>
            {isLoadingVideo ? (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>Loading video guide...</Text>
              </View>
            ) : videoError ? (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>{videoError}</Text>
              </View>
            ) : videoId ? (
              <View style={styles.videoContainer}>
                <WebView
                  style={styles.video}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{
                    uri: `https://www.youtube.com/embed/${videoId}`,
                    headers: {
                      'Referer': 'https://www.youtube.com'
                    }
                  }}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
      ) : null}

      {/* Exercise Finished Button */}
      {!showConfirmation && !showRatingPage ? (
        <TouchableOpacity style={styles.finishedButton} onPress={handleExerciseFinished}>
          <Text style={styles.finishedButtonText}>Exercise Finished</Text>
        </TouchableOpacity>
      ) : null}

      {/* Confirmation Message */}
      {showConfirmation ? (
        <Animated.View style={[styles.confirmationContainer, { opacity: fadeAnim }]}>
          <Text style={styles.confirmationText}>Exercise Marked as Finished!</Text>
        </Animated.View>
      ) : null}

      {/* Rating Page */}
      {showRatingPage ? (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Rate This Exercise</Text>

          {/* Level of Detail Rating */}
          <Text style={styles.ratingSubtitle}>Level of Detail</Text>
          <StarRating rating={detailRating} onRate={setDetailRating} />

          {/* Ease of Completion Rating */}
          <Text style={styles.ratingSubtitle}>Ease of Completion</Text>
          <StarRating rating={easeRating} onRate={setEaseRating} />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleRatingSubmit}>
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -50, // Adjust this value to position the Header correctly
  },
  scrollContainer: {
    padding: 20,
    marginTop: 50, // Adjust this value to position the content below the Header
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    top: 200, // Adjust this value to position the FAB below the Header
    right: 320,
    backgroundColor: "#005CEE",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1, // Ensure the FAB is above other content
  },
  videoSection: {
    marginTop: 20,
    marginBottom: 100, // Add significant bottom margin
    paddingBottom: 20, // Add padding at the bottom
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  videoPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  videoPlaceholderText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  finishedButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#005CEE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  finishedButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  confirmationContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -140 }, { translateY: 40 }],
    backgroundColor: "#005CEE",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmationText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  ratingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ratingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingSubtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#005CEE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    marginBottom: 20, // Add margin below the video container
  },
  video: {
    flex: 1,
  },
});

export default ExerciseDetail;