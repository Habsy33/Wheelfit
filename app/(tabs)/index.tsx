import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Header } from '@/components/Header';
import { Redirect } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Redirect href="../(auth)/SignIn" />;
  }

  return <Workouts />;
}

const workoutsData = [
  { title: 'Abs - Intermediate', duration: '25 mins', level: 'Intermediate', image: require('@/assets/images/abs.png') },
  { title: 'Chest - Easy', duration: '15 mins', level: 'Beginner', image: require('@/assets/images/chest.png') },
  { title: 'Shoulder & Back - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/shoulder_back.png') },
  { title: 'Arms - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/arms.png') },
  { title: 'Follow Along - Advanced', duration: '15 mins', level: 'Advanced', image: require('@/assets/images/arms.png') },
];

function Workouts() {
  const colorScheme = useColorScheme();

  const renderWorkout = ({ item }: any) => (
    <TouchableOpacity style={styles.workoutCard}>
      <Image source={item.image} style={styles.workoutImage} />
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutTitle}>{item.title}</Text>
        <Text style={styles.workoutSubtitle}>
          {item.duration} • {item.level}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ThemedView style={styles.container}>
        <FlatList
          data={workoutsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWorkout}
          ListHeaderComponent={
            <>
              <Header title="WheelFit" streak="28/30" subtitle="Adaptive Home Workouts" />
              <TextInput style={styles.searchInput} placeholder="Search workouts, plans..." placeholderTextColor="#A9A9A9" />
              <Text style={styles.welcomeText}>Welcome, User</Text>
              <Text style={styles.sectionTitle}>Featured Workouts</Text>
              <View style={styles.featuredContainer}>
                <FlatList
                  data={[
                    {
                      title: 'MASSIVE UPPER BODY',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                      image: require('@/assets/images/featured_workout.png'),
                    },
                    {
                      title: 'LEGS & CORE BLAST',
                      description: 'Push your limits with this intense workout for legs and core.',
                      image: require('@/assets/images/featured_workout.png'),
                    },
                  ]}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.featuredCard}>
                      <Image source={item.image} style={styles.featuredImage} />
                      <Text style={styles.featuredText}>{item.title}</Text>
                      <Text style={styles.featuredDesc}>{item.description}</Text>
                      <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <Text style={[styles.sectionTitle, styles.quickStartTitle]}>Quick Start</Text>
              <Text style={styles.classicText}>Classic Workouts</Text>
              <View style={styles.filterContainer}>
                <Text style={styles.filterBadge}>Beginner</Text>
                <Text style={styles.filterBadge}>Intermediate</Text>
                <Text style={styles.filterBadge}>Advanced</Text>
              </View>
            </>
          }
          contentContainerStyle={styles.workoutsList}
        />
      </ThemedView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F1F0F0', // Matches the app background
    marginTop: -50,
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F0F0',
  },
  scrollContainer: {
    padding: 1,
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 1,
    padding: 10,
  },
  featuredContainer: {
    marginTop: 0,
    marginBottom: 10,
    padding: 5,
  },
  featuredCard: {
    backgroundColor: '#4476d8',
    borderRadius: 15,
    padding: 10,
    width: 250,
  },
  featuredImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  featuredText: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuredDesc: {
    marginTop: 4,
    color: '#FFF',
  },
  startButton: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#406DC6',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  quickStartContainer: {
    marginTop: 6,
  },
  quickStartTitle: {
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginTop: 0,
    padding: 10,
  },
  filterBadge: {
    backgroundColor: '#007BFF',
    color: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 16,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  workoutsList: {
    marginTop: -5,
    padding: 10,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  workoutImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  workoutDetails: {
    flex: 1,
  },
  workoutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  workoutSubtitle: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
  classicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: -10,
    marginBottom: -5,
    textAlign: 'left',
    padding: 10,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 0,
    marginBottom: -5,
    textAlign: 'left',
    padding: 10,
  },
});
