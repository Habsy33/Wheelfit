// FeaturedEvents.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { trackEventSignUp, fetchEventParticipants, EventParticipant } from '@/utils/eventsTracking';

const FeaturedEvents = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { title, date, description, image, phone, email, address } = useLocalSearchParams();
  const [participants, setParticipants] = useState<EventParticipant[]>([]);

  useEffect(() => {
    const loadParticipants = async () => {
      if (title) {
        const eventTitle = Array.isArray(title) ? title[0] : title;
        const eventParticipants = await fetchEventParticipants(eventTitle);
        setParticipants(eventParticipants);
      }
    };
    loadParticipants();
  }, [title]);

  const handleSignUp = async () => {
    if (!title || !description) {
      console.error("Missing required event details");
      return;
    }

    try {
      await trackEventSignUp(
        Array.isArray(title) ? title[0] : title,
        Array.isArray(date) ? date[0] : date || "No date provided",
        Array.isArray(description) ? description[0] : description
      );
      console.log("Event sign-up successful!");
      router.push('../expanded-pages/SplashScreenThree');
    } catch (error) {
      console.error("Error signing up for event:", error);
    }
  };

  const handleContactPress = (type: 'phone' | 'email' | 'address') => {
    const getValue = (param: string | string[] | undefined) => {
      return Array.isArray(param) ? param[0] : param;
    };

    switch (type) {
      case 'phone':
        const phoneValue = getValue(phone);
        if (phoneValue) Linking.openURL(`tel:${phoneValue}`);
        break;
      case 'email':
        const emailValue = getValue(email);
        if (emailValue) Linking.openURL(`mailto:${emailValue}`);
        break;
      case 'address':
        const addressValue = getValue(address);
        if (addressValue) Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(addressValue)}`);
        break;
    }
  };

  const getContactValue = (param: string | string[] | undefined) => {
    return Array.isArray(param) ? param[0] : param;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a202c' }}>
      {/* Header Component */}
      <View style={styles.featuredHeader}>
        <Header title="WheelFit" subtitle={Array.isArray(title) ? title[0] : title || "Adaptive Strength Workout"} />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Image
          source={image ? { uri: image } : require('@/assets/images/group_fitness.jpg')}
          style={styles.heroImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.workoutTitle}>{title || "Featured Events"}</Text>
          <Text style={styles.workoutDescription}>
            {date ? `Date: ${date}` : "Build core strength, improve mobility, and stay active."}
          </Text>
        </View>
      </View>

      {/* Workout Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.sectionText}>{description || "Ella's friendly, engaging and knowledgeable style has made her a firm favourite with the disabled community throughout the UK. No gym required!"}</Text>
      </View>

      {/* Contact Details Section */}
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        {(phone || email || address) && (
          <View style={styles.contactList}>
            {phone && (
              <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress('phone')}>
                <Ionicons name="call-outline" size={20} color="#4299e1" />
                <Text style={styles.contactText}>{getContactValue(phone)}</Text>
              </TouchableOpacity>
            )}
            {email && (
              <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress('email')}>
                <Ionicons name="mail-outline" size={20} color="#4299e1" />
                <Text style={styles.contactText}>{getContactValue(email)}</Text>
              </TouchableOpacity>
            )}
            {address && (
              <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress('address')}>
                <Ionicons name="location-outline" size={20} color="#4299e1" />
                <Text style={styles.contactText}>{getContactValue(address)}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Who's Going Section */}
      <View style={styles.participantsContainer}>
        <Text style={styles.sectionTitle}>Who's Going</Text>
        <View style={styles.participantsList}>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <View key={`${participant.userId}-${index}`} style={styles.participantItem}>
                <Image
                  source={participant.profilePicture ? { uri: participant.profilePicture } : require('@/assets/images/profile_pic.png')}
                  style={styles.participantAvatar}
                />
                <Text style={styles.participantName}>{participant.username}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noParticipantsText}>Be the first to sign up!</Text>
          )}
        </View>
      </View>

      {/* Start Workout Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleSignUp}>
          <Text style={styles.startButtonText}>Sign Me Up!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  featuredHeader: {
    marginTop: -60,
  },
  heroSection: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  workoutDescription: {
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  sectionText: {
    color: '#a0aec0',
  },
  startButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4299e1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantsContainer: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 8,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    padding: 8,
    borderRadius: 20,
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  participantName: {
    color: '#a0aec0',
    fontSize: 14,
  },
  noParticipantsText: {
    color: '#a0aec0',
    fontStyle: 'italic',
  },
  contactContainer: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 8,
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    color: '#a0aec0',
    fontSize: 14,
  },
});

export default FeaturedEvents;