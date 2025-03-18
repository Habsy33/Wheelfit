import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FitnessGoalsModal } from './FitnessGoalsModal';
import { auth } from '@/firebaseConfig';
import { getStreakData, updateStreak } from '@/utils/streakFunctions';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [streak, setStreak] = useState<string>("0");
  const [goal, setGoal] = useState<string>("15");
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState<any>(null);

  useEffect(() => {
    const updateUserStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Update streak when component mounts
        const updatedStreakData = await updateStreak(user.uid);
        setStreakData(updatedStreakData);
        setStreak(updatedStreakData?.currentStreak?.toString() || "0");
        setGoal(updatedStreakData?.currentGoal?.toString() || "15");
      } catch (error) {
        console.error("Error updating streak:", error);
        setStreak("0");
        setGoal("15");
      } finally {
        setLoading(false);
      }
    };

    updateUserStreak();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.logoText}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <ActivityIndicator size="small" color="#FF4500" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.logoText}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.streakContainer}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome5 name="fire" size={24} color="#FF4500" />
          <Text style={styles.streakText}>{streak}/{goal}</Text>
        </TouchableOpacity>
      </View>
      <FitnessGoalsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        streak={streak}
        goal={goal}
        streakData={streakData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#406DC6',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: -2,
  },
  headerContainer: {
    marginTop: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#D3D3D3',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#FF4500',
    fontWeight: 'bold',
  },
});
