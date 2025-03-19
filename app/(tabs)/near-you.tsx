import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WebView } from 'react-native-webview';
import { Header } from '@/components/Header';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { fetchEventsTracking, deleteEventTracking, EventTrackingData } from '@/utils/eventsTracking';
import { Ionicons } from '@expo/vector-icons';

const eventsData = [
  {
    title: 'EXERCISE CLASS WITH ELLA',
    description: "Ella's friendly, engaging and knowledgeable style has made her a firm favourite with the disabled community throughout the UK. No gym required!",
    image: require('@/assets/images/ella.png'),
    contact: {
      phone: '+44 141 123 4567',
      email: 'ella@wheelfit.com',
      address: '35 Scotland Street, G1 1PK, Glasgow'
    }
  },
  {
    title: 'DISCOVER TAI CHI',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('@/assets/images/tai_chi.jpg'),
    contact: {
      phone: '+44 141 987 6543',
      email: 'taichi@wheelfit.com',
      address: 'Online Event'
    }
  },
  {
    title: 'DISCOVER MORE TAI CHI',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('@/assets/images/tyshi.png'),
    contact: {
      phone: '+44 141 555 1234',
      email: 'taichi.advanced@wheelfit.com',
      address: '123 Queen Street, G1 3EX, Glasgow'
    }
  },
  {
    title: 'EXTENDED EXERCISE CLASS WITH ELLA',
    description: "Ella's friendly, engaging and knowledgeable style has made her a firm favourite with the disabled community throughout the UK. No gym required!",
    image: require('@/assets/images/exercise_class_ella.jpg'),
    contact: {
      phone: '+44 141 123 4567',
      email: 'ella@wheelfit.com',
      address: '35 Scotland Street, G1 1PK, Glasgow'
    }
  },
];

const fitnessCentersData = [
  { name: 'Thrive Fitness Glasgow', details: '6am - 10pm / Wheelchair Accessible', category: 'Accessible', distance: 1.2, image: require('@/assets/images/fitness_center.png') },
  { name: 'Wellness Glasgow', details: '6am - 10pm / Near Park', category: 'Park', distance: 2.8, image: require('@/assets/images/wellness.jpg') },
  { name: 'Accessibility+ Glasgow', details: '6am - 10pm / Wheelchair Accessible', category: 'Accessible', distance: 0.5, image: require('@/assets/images/gcc_gym.jpg') },
  { name: 'Powerhouse Glasgow', details: '6am - 10pm / General Gym', category: 'General', distance: 3.4, image: require('@/assets/images/accessible_gym.jpg') },
];

const EventCard = ({ event, onDelete }: { event: EventTrackingData; onDelete: (eventId: string) => void }) => {
  const handleDelete = () => {
    Alert.alert(
      "Cancel Event",
      "Are you sure you want to cancel your registration for this event?",
      [
        {
          text: "No, Keep It",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => onDelete(event.eventId)
        }
      ]
    );
  };

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.eventTitleContainer}>
          <Text style={styles.eventTitle}>{event.eventName}</Text>
          <Text style={styles.eventDate}>{event.eventDate}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.eventDescription}>{event.eventDescription}</Text>
    </View>
  );
};

export default function NearYou() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;
  console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY);

  const getFilteredEvents = () => {
    if (!searchQuery.trim()) {
      return eventsData;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return eventsData.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    );
  };

  const renderEventCard = (event: any) => {
    const truncatedDescription = event.description.length > 50 
      ? `${event.description.substring(0, 50)}...` 
      : event.description;
  
    return (
      <TouchableOpacity 
        key={event.title} 
        style={styles.featuredEventCard} 
        onPress={() => router.push({ 
          pathname: "../expanded-pages/FeaturedEvents", 
          params: { 
            title: event.title, 
            description: event.description,
            date: "20/02/25",
            image: event.image,
            phone: event.contact.phone,
            email: event.contact.email,
            address: event.contact.address
          } 
        })}
      >
        <View style={styles.smallBox}>
          <Text style={styles.smallBoxText}>20/02/25</Text>
        </View>
        <Image source={event.image} style={styles.eventImage} />
        <View style={styles.featuredEventContent}>
          <Text style={styles.featuredEventTitle}>{event.title}</Text>
          <Text style={styles.featuredEventDescription}>{truncatedDescription}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFitnessCenterCard = (center: any) => (
    <TouchableOpacity 
      style={styles.fitnessCenterCard} 
      key={center.name}
      onPress={() => router.push({
        pathname: "../expanded-pages/fitnessCentre",
        params: {
          name: center.name,
          details: center.details,
          distance: center.distance,
          image: center.image,
          category: center.category,
        }
      })}
    >
      <Image source={center.image} style={styles.fitnessCenterImage} />
      <View style={styles.fitnessCenterDetails}>
        <Text style={styles.fitnessCenterName}>{center.name}</Text>
        <Text style={styles.fitnessCenterInfo}>{center.details} ( {center.distance} km )</Text>
      </View>
    </TouchableOpacity>
  );

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const getFilteredFitnessCenters = () => {
    let filteredCenters = [...fitnessCentersData];
    if (selectedFilter === 'Accessible') {
      filteredCenters = filteredCenters.filter(center => center.category === 'Accessible');
    } else if (selectedFilter === 'Park') {
      filteredCenters = filteredCenters.filter(center => center.category === 'Park');
    } else if (selectedFilter === 'Close by') {
      filteredCenters.sort((a, b) => a.distance - b.distance);
    }
    return filteredCenters;
  };

  const [events, setEvents] = useState<EventTrackingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsTracking((fetchedEvents) => {
      setEvents(fetchedEvents);
      setLoading(false);
    });
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventTracking(eventId);
      // The events list will automatically update due to the onValue listener in fetchEventsTracking
    } catch (error) {
      console.error("Error deleting event:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Header title="WheelFit" subtitle="Find Events and Centers Near You" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search workouts, plans..." 
          placeholderTextColor="#A9A9A9"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Events Near You</Text>
          <Text style={styles.featuredText}>Featured Events</Text>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredEventsContainer}
          >
            {getFilteredEvents().map(renderEventCard)}
          </ScrollView>

          <View style={styles.sectionDivider} />
          
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
            {['Accessible Venues', 'Parks', 'Close by'].map(filter => (
              <TouchableOpacity key={filter} style={styles.filterButton} onPress={() => setSelectedFilter(filter)}>
                <Text style={styles.filterButtonText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.fitnessCentersContainer}>
            {getFilteredFitnessCenters().map(center => renderFitnessCenterCard(center))}
          </View>
          <ScrollView style={styles.eventsList}>
            {events.map((event) => (
              <EventCard 
                key={event.eventId} 
                event={event} 
                onDelete={handleDeleteEvent}
              />
            ))}
          </ScrollView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -60,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featuredText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featuredEventsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  featuredEventCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  featuredEventContent: {
    padding: 12,
  },
  featuredEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredEventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  sectionDivider: {
    marginTop: -20,
    height: 1,
    marginVertical: 24,
  },
  smallBox: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3,
  },
  smallBoxText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  filterButton: {
    backgroundColor: '#005CEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  fitnessCentersContainer: {
    paddingHorizontal: 16,
  },
  fitnessCenterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fitnessCenterImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  fitnessCenterDetails: {
    flex: 1,
  },
  fitnessCenterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fitnessCenterInfo: {
    fontSize: 14,
    color: '#666',
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  eventsList: {
    marginTop: 16,
  },
});