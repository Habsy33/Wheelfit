import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function FitnessCentre() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageError, setImageError] = useState(false);
  
  // Extract parameters from the route
  const {
    name,
    details,
    distance,
    image,
    category,
    openingHours = '6am - 10pm',
    description = 'A modern fitness center equipped with state-of-the-art facilities and dedicated staff to help you achieve your fitness goals.',
    accessibility = 'Wheelchair accessible with ramps and elevators throughout the facility',
    amenities = 'Parking, Changing Rooms, Shower Facilities, Water Fountain',
  } = params;

  const imageSource: ImageSourcePropType = typeof image === 'string' 
    ? { uri: image } 
    : image as ImageSourcePropType;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Header title="WheelFit" subtitle="Fitness Centre Details" />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Back to Near You</Text>
        </TouchableOpacity>

        <ScrollView style={styles.content}>
          <View style={styles.imageContainer}>
            {!imageError ? (
              <Image 
                source={imageSource}
                style={styles.centreImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="fitness-outline" size={50} color="#CCCCCC" />
                <Text style={styles.placeholderText}>Fitness Centre Image</Text>
              </View>
            )}
          </View>
          
          <View style={styles.mainContent}>
            <Text style={styles.centreName}>{name}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.distance}>{distance} km away</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              <Text style={styles.sectionContent}>{openingHours}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>{description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              <Text style={styles.sectionContent}>{accessibility}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <Text style={styles.sectionContent}>{amenities}</Text>
            </View>

            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => {
                // Here you would typically integrate with a maps app
                console.log('Get directions pressed');
              }}
            >
              <Ionicons name="navigate-outline" size={20} color="#FFF" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -55,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  centreImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  mainContent: {
    padding: 16,
  },
  centreName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  category: {
    backgroundColor: '#007BFF',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 14,
    marginRight: 12,
  },
  distance: {
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  directionsButton: {
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  directionsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 8,
    fontWeight: '600',
  },
}); 