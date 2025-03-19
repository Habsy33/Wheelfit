import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { Header } from '@/components/Header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { confirmMeetupAttendance, cancelMeetupAttendance, getUserMeetups, getMeetupDetails, initializeDefaultMeetups } from '@/utils/meetupFunctions';
import { ref, onValue, db } from '@/firebaseConfig';

// Define the type for the query parameters
interface QueryParams {
  id?: string;
  date?: string;
  title?: string;
  location?: string;
  format?: string;
}

interface Meetup {
  id: string;
  date: string;
  title: string;
  location: string;
  format: string;
  details: string;
  address: string;
  venueSize: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
}

const MeetupsPage: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const router = useRouter();
  const { id, date, title, location, format } = useLocalSearchParams() as QueryParams;
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [userMeetups, setUserMeetups] = useState<any[]>([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const initializeMeetups = async () => {
      try {
        await initializeDefaultMeetups();
        const meetupsRef = ref(db, 'meetups');
        
        onValue(meetupsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const meetupsArray = Object.entries(data).map(([id, meetupData]: [string, any]) => ({
              id,
              ...meetupData
            }));
            setMeetups(meetupsArray);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error initializing meetups:", error);
        setIsLoading(false);
      }
    };

    initializeMeetups();
  }, []);

  useEffect(() => {
    if (id) {
      const meetup = meetups.find(m => m.id === id);
      if (meetup) {
        setSelectedMeetup(meetup);
        setIsDetailsVisible(true);
      }
    }
  }, [id, meetups]);

  useEffect(() => {
    getUserMeetups((meetups) => {
      setUserMeetups(meetups);
    });
  }, []);

  const handleMeetupSelect = (item: Meetup) => {
    setSelectedMeetup(item);
    setIsDetailsVisible(true);
  };

  const handleConfirmAttendance = async () => {
    if (!selectedMeetup) return;
    
    try {
      await confirmMeetupAttendance(selectedMeetup.id);
      setShowSuccessModal(true);
      // Close modal and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/forum');
      }, 2000);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCancelAttendance = async () => {
    if (!selectedMeetup) return;
    
    try {
      await cancelMeetupAttendance(selectedMeetup.id);
      setShowSuccessModal(true);
      // Close modal and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/forum');
      }, 2000);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const isUserAttending = (meetupId: string) => {
    return userMeetups.some(meetup => meetup.meetupId === meetupId && meetup.status === 'confirmed');
  };

  const renderMeetupDetails = () => {
    if (!selectedMeetup || !isDetailsVisible) return null;

    const isAttending = isUserAttending(selectedMeetup.id);

    return (
      <View style={styles.detailsContainer}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setIsDetailsVisible(false)}
        >
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>

        <ScrollView style={styles.detailsScroll}>
          <Text style={styles.detailsTitle}>{selectedMeetup.title}</Text>
          <View style={styles.detailsRow}>
            <MaterialIcons name="event" size={20} color="#666" />
            <Text style={styles.detailsText}>{selectedMeetup.date}</Text>
          </View>
          <View style={styles.detailsRow}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.detailsText}>{selectedMeetup.location}</Text>
          </View>
          <View style={styles.detailsRow}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.detailsText}>{selectedMeetup.duration}</Text>
          </View>
          <View style={styles.detailsRow}>
            <MaterialIcons name="people" size={20} color="#666" />
            <Text style={styles.detailsText}>{selectedMeetup.venueSize}</Text>
          </View>
          <View style={styles.detailsRow}>
            <MaterialIcons name="home" size={20} color="#666" />
            <Text style={styles.detailsText}>{selectedMeetup.address}</Text>
          </View>
          <Text style={styles.detailsDescription}>{selectedMeetup.details}</Text>
          <Text style={styles.participantsText}>
            Participants: {selectedMeetup.currentParticipants}/{selectedMeetup.maxParticipants}
          </Text>
        </ScrollView>

        <View style={styles.actionButtons}>
          {isAttending ? (
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelAttendance}
            >
              <Text style={styles.buttonText}>Cancel Attendance</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirmAttendance}
            >
              <Text style={styles.buttonText}>Confirm Attendance</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Wheelfit" subtitle="Meetups Calendar" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#005CEE" />
          </TouchableOpacity>

          {/* Meetups Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="info-outline" size={24} color="#005CEE" />
              <Text style={styles.infoTitle}>About Wheelfit Meetups</Text>
            </View>
            <Text style={styles.infoText}>
              Wheelfit Meetups are physical fitness events aimed at promoting physical activity among wheelchair and limited mobility users of the app. These meetups can vary, and are always interesting, this can be a great way to meet people with similar mobility from your community and foster positive relationships.
            </Text>
            <View style={styles.differenceContainer}>
              <Text style={styles.differenceTitle}>How Meetups Differ from Events:</Text>
              <Text style={styles.differenceText}>
                Wheelfit Meetups focus on community building and social interaction through physical activities, while Wheelfit Events are intended to be exercise routines online/physical only at fitness centres / from home.
              </Text>
            </View>
          </View>

          {renderMeetupDetails()}

          <View style={styles.meetupsListContainer}>
            <Text style={styles.sectionTitle}>Upcoming Meetups</Text>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005CEE" />
              </View>
            ) : (
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
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <MaterialIcons name="check-circle" size={64} color="#4CAF50" />
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successText}>
              {selectedMeetup ? `You have ${isUserAttending(selectedMeetup.id) ? 'confirmed' : 'cancelled'} your attendance for ${selectedMeetup.title}` : ''}
            </Text>
            <Text style={styles.redirectText}>Redirecting to forum...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    marginTop: -50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
    marginBottom: 12,
  },
  meetupsListContainer: {
    flex: 1,
  },
  flatListContent: {
    padding: 8,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10,
    paddingTop: 16,
    paddingLeft: 16,
  },
  detailsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  detailsScroll: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  detailsDescription: {
    fontSize: 16,
    marginTop: 16,
    lineHeight: 24,
  },
  participantsText: {
    fontSize: 16,
    marginTop: 16,
    color: '#666',
  },
  actionButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetupContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    marginBottom: 10, 
    borderRadius: 8 
  },
  meetupDate: { 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#4CAF50', 
    borderRadius: 6 
  },
  meetupMonth: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  meetupDay: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  meetupInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  meetupTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  meetupLocation: { 
    color: '#666' 
  },
  meetupFormat: { 
    color: '#2196F3' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#4CAF50',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  redirectText: {
    fontSize: 14,
    color: '#999',
    marginTop: 16,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005CEE',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  differenceContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#005CEE',
  },
  differenceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  differenceText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default MeetupsPage;
