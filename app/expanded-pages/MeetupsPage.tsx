import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '@/components/Header';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
      <Header title="Wheelfit" subtitle="Meetups Calendar" streak="28/30" />

      {selectedMeetup.id ? (
        <View style={styles.selectedMeetupContainer}>
          <Text style={styles.selectedTitle}>{selectedMeetup.title}</Text>
          <Text style={styles.selectedDate}>{selectedMeetup.date} - {selectedMeetup.location}</Text>
          <Text style={styles.selectedFormat}>{selectedMeetup.format}</Text>
        </View>
      ) : (
        <Text style={styles.noMeetupSelected}>No Meetup Selected</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: -50, },
  scrollContainer: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  selectedMeetupContainer: { padding: 16, backgroundColor: '#e3f2fd', marginBottom: 10, borderRadius: 8 },
  selectedTitle: { fontSize: 18, fontWeight: 'bold' },
  selectedDate: { fontSize: 16, color: '#666' },
  selectedFormat: { fontSize: 16, color: '#2196F3', marginBottom: 5 },
  noMeetupSelected: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
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
