import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const Explore = () => {
  const fitnessInsights = {
    caloriesBurned: 1245,
    minutesExercised: 320,
    totalWorkouts: 15,
  };

  const trainingComparison = {
    currentWeek: 5,
    lastWeek: 3,
  };

  const dailyStreak = 10;

  const motivationalQuote =
    "“Don't limit your challenges, challenge your limits.”";

  return (
    <ScrollView style={styles.container}>
      {/* Motivational Card */}
      <View style={[styles.card, styles.motivationalCard]}>
        <FontAwesome5 name="quote-left" size={24} color="#fff" />
        <Text style={styles.motivationalText}>{motivationalQuote}</Text>
        <FontAwesome5 name="quote-right" size={24} color="#fff" />
      </View>

      {/* Fitness Insights Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fitness Insights</Text>
        <View style={styles.insightRow}>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons
              name="fire"
              size={36}
              color="#FF4500"
            />
            <Text style={styles.insightValue}>
              {fitnessInsights.caloriesBurned}
            </Text>
            <Text style={styles.insightLabel}>Calories Burned</Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons
              name="timer"
              size={36}
              color="#005CEE"
            />
            <Text style={styles.insightValue}>
              {fitnessInsights.minutesExercised}
            </Text>
            <Text style={styles.insightLabel}>Minutes Exercised</Text>
          </View>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={36}
              color="#FFD700"
            />
            <Text style={styles.insightValue}>
              {fitnessInsights.totalWorkouts}
            </Text>
            <Text style={styles.insightLabel}>Total Workouts</Text>
          </View>
        </View>
      </View>

      {/* Training Comparison Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Training Comparison</Text>
        <Text style={styles.trainingText}>
          You trained <Text style={styles.highlight}>{trainingComparison.currentWeek - trainingComparison.lastWeek}</Text> more
          sessions this week than last week!
        </Text>
      </View>

      {/* Daily Streak Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Streak</Text>
        <View style={styles.streakRow}>
          <MaterialCommunityIcons name="run" size={48} color="#32CD32" />
          <Text style={styles.streakText}>
            You're on a <Text style={styles.highlight}>{dailyStreak}-day</Text> streak of exercising daily!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 30,
  },
  motivationalText: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 6,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
  },
  trainingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#005CEE',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    lineHeight: 24,
  },
});

export default Explore;
