import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WebView } from 'react-native-webview';

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

  const renderEventCard = (event: any) => (
    <View style={styles.eventCard} key={event.title}>
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>WheelFit</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for events, activities..."
          placeholderTextColor="#A9A9A9"
        />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Events Near You</Text>
        <View style={styles.eventsContainer}>
          {eventsData.map(renderEventCard)}
        </View>
        <Text style={styles.sectionTitle}>Search Local Fitness Centers</Text>
        <View style={styles.mapContainer}>
          <WebView
            source={{
              uri: 'https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=wheelchair+accessible+fitness+centers+near+me',
            }}
            style={styles.map}
          />
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Accessible Venues</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Parks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Close by</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fitnessCentersContainer}>
          {fitnessCentersData.map(renderFitnessCenterCard)}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  eventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  eventCard: {
    width: '48%',
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
  mapContainer: {
    height: 200,
    marginVertical: 16,
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
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
});

