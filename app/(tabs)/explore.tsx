import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { fetchExerciseTracking, deleteExerciseTracking, ExerciseTrackingData } from '@/utils/fitnessTracker'; 
import { fetchEventsTracking, deleteEventTracking, EventTrackingData } from '@/utils/eventsTracking';
import { auth } from '@/firebaseConfig';
import { getStreakData, updateStreak } from '@/utils/streakFunctions';

const EventItem = ({ event, onDelete }: { event: EventTrackingData; onDelete: (eventId: string) => void }) => {
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
    <View style={styles.eventItem}>
      <MaterialCommunityIcons
        name="calendar"
        size={24}
        color="#005CEE"
        style={styles.eventIcon}
      />
      <View style={styles.eventDetails}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventText}>
            {event.eventName} - {event.eventDate}
          </Text>
          <TouchableOpacity 
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.eventDescription}>
          {event.eventDescription}
        </Text>
      </View>
    </View>
  );
};

const ExerciseItem = ({ exercise, onDelete }: { exercise: ExerciseTrackingData; onDelete: (exerciseId: string) => void }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to remove this exercise from your history?",
      [
        {
          text: "No, Keep It",
          style: "cancel"
        },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => onDelete(exercise.firebaseId!)
        }
      ]
    );
  };

  return (
    <View style={styles.exerciseItem}>
      <MaterialCommunityIcons
        name="dumbbell"
        size={24}
        color="#005CEE"
        style={styles.exerciseIcon}
      />
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseText}>
            {exercise.exerciseName} - {exercise.bodyPart}
          </Text>
          <TouchableOpacity 
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.exerciseRating}>
          Detail: {exercise.detailRating} ⭐ | Ease: {exercise.easeRating} ⭐
        </Text>
      </View>
    </View>
  );
};

const Explore = () => {
  const [exerciseTrackingData, setExerciseTrackingData] = useState<ExerciseTrackingData[]>([]);
  const [eventsTrackingData, setEventsTrackingData] = useState<EventTrackingData[]>([]);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [streakData, setStreakData] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const motivationalQuotes = [
    "“Don't limit your challenges, challenge your limits.”",
    "“The only disability in life is a bad attitude.”",
    "“Your potential is limitless. Your effort sets the boundaries.”"
  ];

  // Fade animation function
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === motivationalQuotes.length - 1 ? 0 : prevIndex + 1
      );
      fadeIn();
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fadeOut();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch exercise tracking data on component mount
  useEffect(() => {
    fetchExerciseTracking((data) => {
      setExerciseTrackingData(data);
    });
  }, []);

  // Fetch events tracking data on component mount
  useEffect(() => {
    fetchEventsTracking((data) => {
      setEventsTrackingData(data);
    });
  }, []);

  // Add useEffect for streak data
  useEffect(() => {
    const updateUserStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const updatedStreakData = await updateStreak(user.uid);
        setStreakData(updatedStreakData);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };

    updateUserStreak();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventTracking(eventId);
      // The events list will automatically update due to the onValue listener in fetchEventsTracking
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert(
        "Error",
        "Failed to cancel event. Please try again."
      );
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExerciseTracking(exerciseId);
      // The exercises list will automatically update due to the onValue listener in fetchExerciseTracking
    } catch (error) {
      console.error("Error deleting exercise:", error);
      Alert.alert(
        "Error",
        "Failed to delete exercise. Please try again."
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header Component */}
      <Header 
        title="WheelFit" 
        subtitle="Adaptive Home Workouts" 
      />

      <ScrollView style={styles.container}>
        {/* Motivational Card */}
        <View style={[styles.card, styles.motivationalCard]}>
          <View style={styles.quoteContainer}>
            <FontAwesome5 name="quote-left" size={20} color="#fff" style={styles.quoteIcon} />
            <Animated.Text style={[styles.motivationalText, { opacity: fadeAnim }]}>
              {motivationalQuotes[currentQuoteIndex]}
            </Animated.Text>
            <FontAwesome5 name="quote-right" size={20} color="#fff" style={styles.quoteIcon} />
          </View>
        </View>

        {/* Exercise Tracking Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Recent Exercises</Text>
          {exerciseTrackingData.length > 0 ? (
            <>
              {(showAllExercises ? exerciseTrackingData : exerciseTrackingData.slice(0, 2)).map((exercise) => (
                <ExerciseItem 
                  key={exercise.exerciseId} 
                  exercise={exercise} 
                  onDelete={handleDeleteExercise}
                />
              ))}
              {exerciseTrackingData.length > 2 && (
                <TouchableOpacity 
                  onPress={() => setShowAllExercises(!showAllExercises)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAllExercises ? 'Show Less' : `Show More (${exerciseTrackingData.length - 2} more)`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noExercisesText}>No exercises tracked yet. Keep going!</Text>
          )}
        </View>

        {/* Events Tracking Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Signed-Up Events</Text>
          {eventsTrackingData.length > 0 ? (
            <>
              {(showAllEvents ? eventsTrackingData : eventsTrackingData.slice(0, 2)).map((event) => (
                <EventItem 
                  key={event.eventId} 
                  event={event} 
                  onDelete={handleDeleteEvent}
                />
              ))}
              {eventsTrackingData.length > 2 && (
                <TouchableOpacity 
                  onPress={() => setShowAllEvents(!showAllEvents)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAllEvents ? 'Show Less' : `Show More (${eventsTrackingData.length - 2} more)`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noEventsText}>No events signed up yet. Explore events near you!</Text>
          )}
        </View>

        {/* Daily Streak Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Streak</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakMainInfo}>
              <View style={styles.streakIconContainer}>
                <FontAwesome5 name="fire" size={32} color="#FF4500" />
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakCount}>
                  {streakData?.currentStreak || 0} / {streakData?.currentGoal || 15} Days
                </Text>
                <Text style={styles.streakSubtext}>Current Streak</Text>
              </View>
            </View>
            
            <View style={styles.streakStatsContainer}>
              <View style={styles.streakStatItem}>
                <FontAwesome5 name="trophy" size={20} color="#FFD700" />
                <Text style={styles.streakStatText}>
                  Best: {streakData?.longestStreak || 0} days
                </Text>
              </View>
              <View style={styles.streakStatItem}>
                <FontAwesome5 name="dumbbell" size={20} color="#406DC6" />
                <Text style={styles.streakStatText}>
                  Total: {streakData?.totalWorkouts || 0} workouts
                </Text>
              </View>
              <View style={styles.streakStatItem}>
                <FontAwesome5 name="calendar-check" size={20} color="#4CAF50" />
                <Text style={styles.streakStatText}>
                  Last: {streakData?.lastWorkoutDate ? new Date(streakData.lastWorkoutDate).toLocaleDateString() : 'Never'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: -60,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  motivationalCard: {
    backgroundColor: '#005CEE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  motivationalText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  quoteIcon: {
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  exerciseIcon: {
    marginRight: 10,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap', // Allow text to wrap
  },
  exerciseRating: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noExercisesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  eventIcon: {
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap', // Allow text to wrap
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  streakContainer: {
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    padding: 16,
  },
  streakMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIconContainer: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  streakSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  streakStatsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
  },
  streakStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakStatText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  showMoreButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  showMoreText: {
    color: '#005CEE',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
});

export default Explore;