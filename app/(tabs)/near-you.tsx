import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WebView } from 'react-native-webview';
import { Header } from '@/components/Header'; // Importing the Header component
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';

// import { GOOGLE_MAPS_API_KEY } from "@env";
// console.log(GOOGLE_MAPS_API_KEY); // Check if it's loading correctly


const eventsData = [
  {
    title: 'EXERCISE CLASS WITH ELLA',
    date: '15th Jan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('@/assets/images/event1.png'),
  },
  {
    title: 'DISCOVER TAI CHI',
    date: '18th Jan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('@/assets/images/event2.png'),
  },
];

const fitnessCentersData = [
  {
    name: 'Thrive Fitness Glasgow',
    details: '6am - 10pm / 7D/Week / Wheelchair Accessible / Free Parking',
    image: require('@/assets/images/fitness_center.png'),
  },
];

export default function NearYou() {
  const colorScheme = useColorScheme();

  // const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;


  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;
  console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY);

  const renderEventCard = (event: any) => (
    <View style={styles.eventCard} key={event.title}>
      <View style={styles.smallBox}>
        <Text style={styles.smallBoxText}>New!</Text>
      </View>
      <Image source={event.image} style={styles.eventImage} />
      <Text style={styles.eventDate}>{event.date}</Text>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  );
  

  const renderFitnessCenterCard = (center: any) => (
    <View style={styles.fitnessCenterCard} key={center.name}>
      <Image source={center.image} style={styles.fitnessCenterImage} />
      <View style={styles.fitnessCenterDetails}>
        <Text style={styles.fitnessCenterName}>{center.name}</Text>
        <Text style={styles.fitnessCenterInfo}>{center.details}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Header streak="7/7" title="WheelFit" subtitle="Find Events and Centers Near You" />
        <TextInput style={styles.searchInput} placeholder="Search workouts, plans..." placeholderTextColor="#A9A9A9" />
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Events Near You</Text>
          <Text style={styles.featuredText}>Featured Events</Text>
          <View style={styles.eventsContainer}>{eventsData.map(renderEventCard)}</View>
          <Text style={styles.sectionSubtitle}>Search Local Fitness Centers</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{ latitude: 55.8642, longitude: -4.2518, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
            >
              <Marker coordinate={{ latitude: 55.8642, longitude: -4.2518 }} title="Glasgow" />
            </MapView>
          </View>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterButtonText}>Accessible Venues</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterButtonText}>Parks</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterButtonText}>Close by</Text></TouchableOpacity>
          </View>
          <View style={styles.fitnessCentersContainer}>{fitnessCentersData.map(renderFitnessCenterCard)}</View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF', // Set background color to #FFF
    marginTop: -48,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Set background color to #FFF
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 30, // Increased font size
    fontWeight: 'bold',
    marginVertical: 8,
    padding: 10,
    marginTop: -10,
  },
  sectionSubtitle: {
    fontSize: 20, // Increased font size
    fontWeight: 'bold',
    marginVertical: 8,
    padding: 10,
    marginTop: -10,
  },
  featuredText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: -20,
    padding: 12.5,
  },
  eventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  smallBox: {
    position: 'absolute',
    top: 5,
    left: 5, // Add padding for better positioning
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingHorizontal: 6, // Slightly wider for text fit
    paddingVertical: 2, // Adjust height for text fit
    zIndex: 10, // Ensure it stacks above other elements
    alignItems: 'center',
      // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 }, // Horizontal and vertical shadow offset
    shadowOpacity: 0.7, // Opacity of the shadow
    shadowRadius: 4, // How blurry the shadow is
    // Shadow for Android
    elevation: 3, // Elevation value for Android shadows
  },
  smallBoxText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative', // Required for absolute positioning of smallBox
    overflow: 'hidden', // Ensure elements do not spill outside the card
  },  
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  eventDate: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 12,
    color: '#555',
  },
  mapContainer: { width: '100%', height: 200, borderRadius: 8, overflow: 'hidden', marginVertical: 10, padding: 10, },
  map: { width: '100%', height: '100%' , borderRadius: 20},
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  filterButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  fitnessCentersContainer: {
    marginTop: 16,
  },
  fitnessCenterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fitnessCenterImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  fitnessCenterDetails: {
    flex: 1,
  },
  fitnessCenterName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fitnessCenterInfo: {
    fontSize: 12,
    color: '#555',
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
});
