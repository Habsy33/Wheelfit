import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  totalWorkouts: number;
  lastWorkoutDate: string;
  currentGoal: number;
}

interface FitnessGoalsModalProps {
  visible: boolean;
  onClose: () => void;
  streak: string;
  goal: string;
  streakData: StreakData | null;
}

export const FitnessGoalsModal: React.FC<FitnessGoalsModalProps> = ({
  visible,
  onClose,
  streak,
  goal,
  streakData,
}) => {
  // Example data - replace with actual user data
  const goals = {
    daily: {
      workouts: 1,
      minutes: 30,
      calories: 300,
    },
    weekly: {
      workouts: 5,
      minutes: 150,
      calories: 1500,
    },
    monthly: {
      workouts: 20,
      minutes: 600,
      calories: 6000,
    },
  };

  const renderGoalCard = (period: string, data: any) => (
    <View style={styles.goalCard}>
      <Text style={styles.periodTitle}>{period}</Text>
      <View style={styles.goalRow}>
        <View style={styles.goalItem}>
          <FontAwesome5 name="dumbbell" size={20} color="#406DC6" />
          <Text style={styles.goalValue}>{data.workouts}</Text>
          <Text style={styles.goalLabel}>Workouts</Text>
        </View>
        <View style={styles.goalItem}>
          <FontAwesome5 name="clock" size={20} color="#406DC6" />
          <Text style={styles.goalValue}>{data.minutes}</Text>
          <Text style={styles.goalLabel}>Minutes</Text>
        </View>
        <View style={styles.goalItem}>
          <FontAwesome5 name="fire" size={20} color="#FF4500" />
          <Text style={styles.goalValue}>{data.calories}</Text>
          <Text style={styles.goalLabel}>Calories</Text>
        </View>
      </View>
    </View>
  );

  const renderStreakInfo = () => (
    <View style={styles.streakInfoContainer}>
      <View style={styles.streakContainer}>
        <FontAwesome5 name="fire" size={32} color="#FF4500" />
        <View style={styles.streakTextContainer}>
          <Text style={styles.streakText}>{streak} Day Streak</Text>
          <Text style={styles.goalText}>Goal: {goal} days</Text>
        </View>
      </View>
      
      {streakData && (
        <View style={styles.streakStatsContainer}>
          <View style={styles.streakStat}>
            <FontAwesome5 name="trophy" size={20} color="#FFD700" />
            <Text style={styles.streakStatText}>Best: {streakData.longestStreak} days</Text>
          </View>
          <View style={styles.streakStat}>
            <FontAwesome5 name="dumbbell" size={20} color="#406DC6" />
            <Text style={styles.streakStatText}>Total Workouts: {streakData.totalWorkouts}</Text>
          </View>
          <View style={styles.streakStat}>
            <FontAwesome5 name="calendar-check" size={20} color="#4CAF50" />
            <Text style={styles.streakStatText}>Last Workout: {new Date(streakData.lastWorkoutDate).toLocaleDateString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Fitness Goals</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {renderStreakInfo()}

          <ScrollView style={styles.goalsContainer}>
            {renderGoalCard('Daily Goals', goals.daily)}
            {renderGoalCard('Weekly Goals', goals.weekly)}
            {renderGoalCard('Monthly Goals', goals.monthly)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  streakInfoContainer: {
    marginBottom: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  streakTextContainer: {
    marginLeft: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  goalText: {
    fontSize: 14,
    color: '#FF4500',
    opacity: 0.8,
  },
  streakStatsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  streakStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakStatText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  goalsContainer: {
    flex: 1,
  },
  goalCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
  },
}); 