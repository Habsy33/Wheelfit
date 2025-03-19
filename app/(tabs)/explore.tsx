import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { fetchExerciseTracking, deleteExerciseTracking, ExerciseTrackingData } from '@/utils/fitnessTracker'; 
import { fetchEventsTracking, deleteEventTracking, EventTrackingData } from '@/utils/eventsTracking';
import { auth } from '@/firebaseConfig';
import { getStreakData, updateStreak } from '@/utils/streakFunctions';
import { getUserMeetupsWithDetails, confirmMeetupAttendance, cancelMeetupAttendance } from '@/utils/meetupFunctions';
import { router } from 'expo-router';

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

const MeetupItem = ({ meetup, onCancel }: { meetup: any; onCancel: (meetupId: string) => void }) => {
  const handleCancel = () => {
    Alert.alert(
      "Cancel Meetup",
      "Are you sure you want to cancel your attendance for this meetup?",
      [
        {
          text: "No, Keep It",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => onCancel(meetup.id)
        }
      ]
    );
  };

  return (
    <View style={styles.meetupItem}>
      <MaterialCommunityIcons
        name="account-group"
        size={24}
        color="#005CEE"
        style={styles.meetupIcon}
      />
      <View style={styles.meetupDetails}>
        <View style={styles.meetupHeader}>
          <Text style={styles.meetupText}>
            {meetup.title} - {meetup.date}
          </Text>
          <TouchableOpacity 
            onPress={handleCancel}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.meetupDescription}>
          {meetup.details}
        </Text>
        <Text style={styles.meetupLocation}>
          {meetup.location} • {meetup.format}
        </Text>
      </View>
    </View>
  );
};

const ExerciseInsights = ({ exerciseCount }: { exerciseCount: number }) => {
  const getInsightMessage = () => {
    if (exerciseCount === 0) {
      return {
        message: "Start your fitness journey today! Every small step counts towards your goals.",
        icon: "rocket",
        color: "#FF6B6B"
      };
    } else if (exerciseCount <= 2) {
      return {
        message: "Great start! Keep building momentum - consistency is key to success.",
        icon: "seedling",
        color: "#4CAF50"
      };
    } else if (exerciseCount <= 5) {
      return {
        message: "You're on fire! Your dedication is showing great results.",
        icon: "fire",
        color: "#FF4500"
      };
    } else {
      return {
        message: "Incredible commitment! You're setting an amazing example for others.",
        icon: "trophy",
        color: "#FFD700"
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <View style={styles.insightContainer}>
      <View style={[styles.insightIconContainer, { backgroundColor: `${insight.color}20` }]}>
        <FontAwesome5 name={insight.icon} size={20} color={insight.color} />
      </View>
      <Text style={styles.insightText}>{insight.message}</Text>
    </View>
  );
};

const EventInsights = ({ eventCount }: { eventCount: number }) => {
  const getInsightMessage = () => {
    if (eventCount === 0) {
      return {
        message: "Discover exciting events in your community! Join others and make new connections.",
        icon: "compass",
        color: "#FF6B6B"
      };
    } else if (eventCount <= 2) {
      return {
        message: "Great start! Keep exploring events to expand your fitness community.",
        icon: "users",
        color: "#4CAF50"
      };
    } else if (eventCount <= 5) {
      return {
        message: "You're actively engaged! Your participation inspires others in the community.",
        icon: "star",
        color: "#FF4500"
      };
    } else {
      return {
        message: "You're a community champion! Your dedication to events is truly inspiring.",
        icon: "crown",
        color: "#FFD700"
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <View style={styles.insightContainer}>
      <View style={[styles.insightIconContainer, { backgroundColor: `${insight.color}20` }]}>
        <FontAwesome5 name={insight.icon} size={20} color={insight.color} />
      </View>
      <Text style={styles.insightText}>{insight.message}</Text>
    </View>
  );
};

const MeetupInsights = ({ meetupCount }: { meetupCount: number }) => {
  const getInsightMessage = () => {
    if (meetupCount === 0) {
      return {
        message: "Connect with others! Join meetups to share experiences and learn together.",
        icon: "handshake",
        color: "#FF6B6B"
      };
    } else if (meetupCount <= 2) {
      return {
        message: "Building connections! Keep joining meetups to grow your support network.",
        icon: "heart",
        color: "#4CAF50"
      };
    } else if (meetupCount <= 5) {
      return {
        message: "You're making great connections! Your active participation is valuable.",
        icon: "smile",
        color: "#FF4500"
      };
    } else {
      return {
        message: "You're a social butterfly! Your commitment to meetups is amazing.",
        icon: "sun",
        color: "#FFD700"
      };
    }
  };

  const insight = getInsightMessage();

  return (
    <View style={styles.insightContainer}>
      <View style={[styles.insightIconContainer, { backgroundColor: `${insight.color}20` }]}>
        <FontAwesome5 name={insight.icon} size={20} color={insight.color} />
      </View>
      <Text style={styles.insightText}>{insight.message}</Text>
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
  const [userMeetups, setUserMeetups] = useState<any[]>([]);
  const [showAllMeetups, setShowAllMeetups] = useState(false);

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

  // Add useEffect for fetching user meetups
  useEffect(() => {
    const fetchUserMeetups = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const meetups = await getUserMeetupsWithDetails(user.uid);
        setUserMeetups(meetups);
      } catch (error) {
        console.error("Error fetching user meetups:", error);
      }
    };

    fetchUserMeetups();
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

  const handleNavigateToNearYou = () => {
    router.push('/near-you');
  };

  const handleNavigateToExercises = () => {
    router.push('/(tabs)');
  };

  const handleNavigateToMeetups = () => {
    router.push('/expanded-pages/MeetupsPage');
  };

  const handleCancelMeetup = async (meetupId: string) => {
    try {
      await cancelMeetupAttendance(meetupId);
      // Refresh the meetups list
      const user = auth.currentUser;
      if (user) {
        const meetups = await getUserMeetupsWithDetails(user.uid);
        setUserMeetups(meetups);
      }
    } catch (error) {
      console.error("Error cancelling meetup:", error);
      Alert.alert(
        "Error",
        "Failed to cancel meetup attendance. Please try again."
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
        {/* Exercise Tracking Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Recent Exercises</Text>
          {exerciseTrackingData.length > 0 ? (
            <>
              {(showAllExercises ? exerciseTrackingData : exerciseTrackingData.slice(0, 1)).map((exercise) => (
                <ExerciseItem 
                  key={exercise.exerciseId} 
                  exercise={exercise} 
                  onDelete={handleDeleteExercise}
                />
              ))}
              {exerciseTrackingData.length > 1 && (
                <TouchableOpacity 
                  onPress={() => setShowAllExercises(!showAllExercises)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAllExercises ? 'Show Less' : `Show More (${exerciseTrackingData.length - 1} more)`}
                  </Text>
                </TouchableOpacity>
              )}
              <ExerciseInsights exerciseCount={exerciseTrackingData.length} />
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No exercises tracked yet. </Text>
              <TouchableOpacity onPress={handleNavigateToExercises}>
                <Text style={styles.emptyStateLink}>Try some exercises!</Text>
              </TouchableOpacity>
              <ExerciseInsights exerciseCount={0} />
            </View>
          )}
        </View>

        {/* Events Tracking Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Signed-Up Events</Text>
          {eventsTrackingData.length > 0 ? (
            <>
              {(showAllEvents ? eventsTrackingData : eventsTrackingData.slice(0, 1)).map((event) => (
                <EventItem 
                  key={event.eventId} 
                  event={event} 
                  onDelete={handleDeleteEvent}
                />
              ))}
              {eventsTrackingData.length > 1 && (
                <TouchableOpacity 
                  onPress={() => setShowAllEvents(!showAllEvents)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAllEvents ? 'Show Less' : `Show More (${eventsTrackingData.length - 1} more)`}
                  </Text>
                </TouchableOpacity>
              )}
              <EventInsights eventCount={eventsTrackingData.length} />
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No events signed up yet. </Text>
              <TouchableOpacity onPress={handleNavigateToNearYou}>
                <Text style={styles.emptyStateLink}>Explore events near you!</Text>
              </TouchableOpacity>
              <EventInsights eventCount={0} />
            </View>
          )}
        </View>

        {/* User Meetups Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Confirmed Meetups</Text>
          {userMeetups.length > 0 ? (
            <>
              {(showAllMeetups ? userMeetups : userMeetups.slice(0, 1)).map((meetup) => (
                <MeetupItem 
                  key={meetup.id} 
                  meetup={meetup}
                  onCancel={handleCancelMeetup}
                />
              ))}
              {userMeetups.length > 1 && (
                <TouchableOpacity 
                  onPress={() => setShowAllMeetups(!showAllMeetups)}
                  style={styles.showMoreButton}
                >
                  <Text style={styles.showMoreText}>
                    {showAllMeetups ? 'Show Less' : `Show More (${userMeetups.length - 1} more)`}
                  </Text>
                </TouchableOpacity>
              )}
              <MeetupInsights meetupCount={userMeetups.length} />
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No meetups confirmed yet. </Text>
              <TouchableOpacity onPress={handleNavigateToMeetups}>
                <Text style={styles.emptyStateLink}>Browse available meetups!</Text>
              </TouchableOpacity>
              <MeetupInsights meetupCount={0} />
            </View>
          )}
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
    marginBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
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
  emptyStateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyStateLink: {
    fontSize: 16,
    color: '#005CEE',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  meetupItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  meetupIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  meetupDetails: {
    flex: 1,
  },
  meetupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  meetupText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
  },
  meetupDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  meetupLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default Explore;