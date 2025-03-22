import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the back icon

const { width } = Dimensions.get("window");

const VideoPlayer = () => {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const [playing, setPlaying] = useState(true);
  const router = useRouter(); // Use the router for navigation

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const handleBackPress = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <Header title="Wheelfit Video Guides" subtitle="Adaptive Workouts" />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="arrow-left" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={200}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
        </View>

        {/* Additional Info */}
        <Text style={styles.infoText}>At Wheelfit we understand some are visual learners, 
            and we want to offer you the most interactive fitness experience, feel free to use our video guides (powered by Youtube) to 
            train at your own pace. {'\n'} 
            
            <Text style={styles.infoBoldText}> {'\n'} From all of us here at Wheelfit.. Enjoy your workout!</Text> </Text>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#F1F0F0", // Match the background color
  },
  container: {
    flex: 1,
    marginTop: -100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20, // Add margin to separate from the header
    marginBottom: 20, // Add margin to separate from the video
    marginLeft: 20,
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007BFF", // Match the icon color
  },
  videoContainer: {
    padding: 10,
    marginTop: 10, // Adjusted margin to separate from the back button
    borderRadius: 10, // Add rounded corners
    overflow: "hidden", // Ensure the video respects the border radius
    backgroundColor: "#000", // Add a background color
    shadowColor: "#000", // Add shadow for consistency
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    color: "#000000", // Match text color
  },
  infoBoldText: {
    fontSize: 23,
    textAlign: "center",
    color: "#000000", // Match text color
    fontWeight: "bold",
  },
});

export default VideoPlayer;