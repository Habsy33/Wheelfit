import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useRouter } from 'expo-router';

export default function SearchResults() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const YOUTUBE_API_KEY = 'AIzaSyBRvTJ7e38xff_NEeTRjgC_y2jyCSfFsoQ'; // Remember to store in .env file

  // Three sets of search suggestions
  const searchSuggestionSets = [
    [
      "Wheelchair Upper Body Workout",
      "Adaptive Yoga for Wheelchair Users",
      "Seated Cardio Exercises",
    ],
    [
      "Wheelchair Core Strengthening",
      "Adaptive Swimming Techniques",
      "Wheelchair Sports Training",
    ],
    [
      "Wheelchair Balance Exercises",
      "Adaptive Dance Workouts",
      "Wheelchair Stretching Routine",
    ],
  ];

  // Function to cycle through suggestion sets
  const cycleSuggestions = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSetIndex((prevIndex) => (prevIndex + 1) % searchSuggestionSets.length);
    });
  };

  // Start cycling when component mounts
  useEffect(() => {
    const interval = setInterval(cycleSuggestions, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
          query
        )}&type=video&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from YouTube API.');
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        setSearchResults([]);
        setError('No results found.');
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPress = () => {
    router.replace('/(tabs)'); // Redirect to the index page
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion); // Set the search query to the selected suggestion
    handleSearch(suggestion); // Trigger the search
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => router.push({ pathname: "/watch/[videoId]", params: { videoId: item.id.videoId } })}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.videoThumbnail}
      />
      <View style={styles.videoDetails}>
        <Text style={styles.videoTitle}>{item.snippet.title}</Text>
        <Text style={styles.videoChannel}>{item.snippet.channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ThemedView style={styles.container}>
        <Header title="WheelFit" subtitle="Adaptive Home Workouts" />
        
        {/* Search Bar and Cancel Button */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts, training videos, plans..."
            placeholderTextColor="#A9A9A9"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          <TouchableOpacity onPress={handleCancelPress}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Search Suggestions */}
        <Animated.View 
          style={[
            styles.suggestionsContainer,
            { opacity: fadeAnim }
          ]}
        >
          {searchSuggestionSets[currentSetIndex].map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Loading Indicator */}
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Search Results */}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.videoId}
          renderItem={renderVideoItem}
          ListEmptyComponent={() => 
            !isLoading ? <Text style={styles.noResultsText}>No results found.</Text> : null
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F1F0F0', // Matches the app background
    marginTop: -60,
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F0F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    color: '#007BFF', // Change to your theme color
    fontSize: 16,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  suggestionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  videoChannel: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});