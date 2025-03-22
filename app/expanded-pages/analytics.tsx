import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { FontAwesome5 } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { fetchExerciseTracking, ExerciseTrackingData } from '@/utils/fitnessTracker';
import { fetchEventsTracking, EventTrackingData } from '@/utils/eventsTracking';
import { auth } from '@/firebaseConfig';
import { getUserMeetupsWithDetails } from '@/utils/meetupFunctions';
import { router } from 'expo-router';

const Analytics = () => {
  const [exerciseData, setExerciseData] = useState<ExerciseTrackingData[]>([]);
  const [eventData, setEventData] = useState<EventTrackingData[]>([]);
  const [meetupData, setMeetupData] = useState<any[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch exercises
      fetchExerciseTracking((data) => {
        setExerciseData(data);
      });

      // Fetch events
      fetchEventsTracking((data) => {
        setEventData(data);
      });

      // Fetch meetups
      try {
        const meetups = await getUserMeetupsWithDetails(user.uid);
        setMeetupData(meetups);
      } catch (error) {
        console.error("Error fetching meetups:", error);
      }
    };

    fetchData();
  }, []);

  // Process data for charts
  const getActivityData = () => {
    const exerciseCount = exerciseData.length;
    const eventCount = eventData.length;
    const meetupCount = meetupData.length;

    return [
      {
        name: 'Exercises',
        count: exerciseCount,
        color: '#FF6B6B',
        legendFontColor: '#7F7F7F',
      },
      {
        name: 'Events',
        count: eventCount,
        color: '#4CAF50',
        legendFontColor: '#7F7F7F',
      },
      {
        name: 'Meetups',
        count: meetupCount,
        color: '#FFD700',
        legendFontColor: '#7F7F7F',
      },
    ];
  };

  const getWeeklyActivityData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const activityData = last7Days.map(day => {
      const dayExercises = exerciseData.filter(ex => 
        new Date(ex.timestamp).toLocaleDateString('en-US', { weekday: 'short' }) === day
      ).length;
      return dayExercises;
    });

    return {
      labels: last7Days,
      datasets: [{
        data: activityData,
      }],
    };
  };

  const activityData = getActivityData();
  const weeklyData = getWeeklyActivityData();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Analytics" subtitle="Your Activity Overview" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <FontAwesome5 name="arrow-left" size={16} color="#005CEE" />
        <Text style={styles.backButtonText}>Back to Explore</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Activity Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity Distribution</Text>
          {exerciseData.length === 0 && eventData.length === 0 && meetupData.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <FontAwesome5 name="chart-pie" size={32} color="#ccc" />
              <Text style={styles.emptyStateText}>No activity data to display yet</Text>
            </View>
          ) : (
            <PieChart
              data={activityData}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 92, 238, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={true}
              center={[Dimensions.get('window').width / 4, 0]}
            />
          )}
        </View>

        {/* Weekly Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Activity</Text>
          {exerciseData.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <FontAwesome5 name="chart-line" size={32} color="#ccc" />
              <Text style={styles.emptyStateText}>No exercise data to display yet</Text>
            </View>
          ) : (
            <LineChart
              data={weeklyData}
              width={Dimensions.get('window').width - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 92, 238, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          {exerciseData.length === 0 && eventData.length === 0 && meetupData.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <FontAwesome5 name="chart-bar" size={32} color="#ccc" />
              <Text style={styles.emptyStateText}>No statistics to display yet</Text>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesome5 name="dumbbell" size={24} color="#FF6B6B" />
                <Text style={styles.statNumber}>{exerciseData.length}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="calendar" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{eventData.length}</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome5 name="users" size={24} color="#FFD700" />
                <Text style={styles.statNumber}>{meetupData.length}</Text>
                <Text style={styles.statLabel}>Meetups</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: -50,
  },
  scrollView: {
    flex: 1,
    padding: 16,

  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#005CEE',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Analytics; 