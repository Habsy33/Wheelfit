import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '@/components/Header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Define the type for the query parameters
interface QueryParams {
  id?: string;
  date?: string;
  title?: string;
  location?: string;
  format?: string;
}

const MeetupsPage: React.FC = () => {
  const [meetups, setMeetups] = useState([
    { id: '1', date: 'Feb 24', title: 'Adaptive Yoga Session', location: 'Glasgow', format: 'In-Person', details: 'A yoga session tailored for wheelchair users and those with limited mobility.' },
    { id: '2', date: 'Mar 2', title: 'Virtual Strength Training', location: 'Online', format: 'Virtual', details: 'A strength-building class conducted via Zoom, focusing on upper body mobility.' },
    { id: '3', date: 'Mar 10', title: 'Community Walk', location: 'Edinburgh', format: 'In-Person', details: 'Join us for a social walk with accessible routes and great company.' },
  ]);
  
  const router = useRouter();
  const { id, date, title, location, format } = useLocalSearchParams() as QueryParams;

  // State for the selected meetup
  const [selectedMeetup, setSelectedMeetup] = useState({
    id: '',
    date: '',
    title: '',
    location: '',
    format: ''
  });

  useEffect(() => {
    if (id && date && title && location && format) {
      setSelectedMeetup({ id, date, title, location, format });
    }
  }, [id, date, title, location, format]);

  const handleMeetupSelect = (item: any) => {
    // Construct the query parameters as part of the URL
//     router.push(`/expanded-pages/MeetupsPage?id=${item.id}&date=${item.date}&title=${item.title}&location=${item.location}&format=${item.format}`);
// change the destination later
  };

  return (
    <View style={styles.container}>
      <Header title="Wheelfit" subtitle="Meetups Calendar" />

      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#005CEE" />
        </TouchableOpacity>

        {selectedMeetup.id ? (
          <View style={styles.selectedMeetupContainer}>
            <Text style={styles.selectedTitle}>{selectedMeetup.title}</Text>
            <View style={styles.selectedDetailsRow}>
              <Text style={styles.selectedDate}>{selectedMeetup.date}</Text>
              <Text style={styles.selectedLocation}>{selectedMeetup.location}</Text>
              <Text style={styles.selectedFormat}>{selectedMeetup.format}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noMeetupSelected}>No Meetup Selected</Text>
        )}

        <View style={styles.meetupsListContainer}>
          <Text style={styles.sectionTitle}>Upcoming Meetups</Text>
          <FlatList
            data={meetups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMeetupSelect(item)}>
                <View style={styles.meetupContainer}>
                  <View style={styles.meetupDate}>
                    <Text style={styles.meetupMonth}>{item.date.split(' ')[0]}</Text>
                    <Text style={styles.meetupDay}>{item.date.split(' ')[1]}</Text>
                  </View>
                  <View style={styles.meetupInfo}>
                    <Text style={styles.meetupTitle}>{item.title}</Text>
                    <Text style={styles.meetupLocation}>{item.location}</Text>
                    <Text style={styles.meetupFormat}>{item.format}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    marginTop: -50,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginBottom: 12,
  },
  meetupsListContainer: {
    flex: 1,
  },
  flatListContent: {
    padding: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10,
    paddingTop: 16,
  },
  selectedMeetupContainer: { 
    padding: 16, 
    backgroundColor: '#e3f2fd', 
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedTitle: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 12,
  },
  selectedDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedDate: { 
    fontSize: 14, 
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  selectedLocation: { 
    fontSize: 14, 
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  selectedFormat: { 
    fontSize: 14, 
    color: '#2196F3',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  noMeetupSelected: { 
    fontSize: 16, 
    color: '#999', 
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginBottom: 16,
  },
  meetupContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 12, marginBottom: 10, borderRadius: 8 },
  meetupDate: { alignItems: 'center', padding: 10, backgroundColor: '#4CAF50', borderRadius: 6 },
  meetupMonth: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  meetupDay: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  meetupInfo: { flex: 1, marginLeft: 12 },
  meetupTitle: { fontSize: 16, fontWeight: 'bold' },
  meetupLocation: { color: '#666' },
  meetupFormat: { color: '#2196F3' },
});

export default MeetupsPage;
