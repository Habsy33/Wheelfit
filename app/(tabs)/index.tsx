import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Header } from '@/components/Header';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { auth, db, ref, get } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../(auth)/AppNavigation';
import { useRouter } from 'expo-router';
import TourGuide from '@/components/TourGuide';

interface Workout {
  title: string;
  duration: string;
  level: string;
  image: any; // Using any for require() images
}

interface FeaturedWorkout extends Workout {
  description: string;
  equipment: string;
  intensity: string;
  exercises: string[];
}

const workoutsData: Workout[] = [
  { title: 'Abs - Intermediate', duration: '25 mins', level: 'Intermediate', image: require('@/assets/images/abs.png') },
  { title: 'Chest - Easy', duration: '15 mins', level: 'Beginner', image: require('@/assets/images/chest.png') },
  { title: 'Shoulder & Back - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/shoulder_back.png') },
  { title: 'Arms - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/arms.png') },
  { title: 'Follow Along - Advanced', duration: '15 mins', level: 'Advanced', image: require('@/assets/images/wheelchairman2.png') },
  { title: 'Full Body Stretch - Easy', duration: '15 mins', level: 'Beginner', image: require('@/assets/images/wheelchairguy1.jpg') },
  { title: 'Follow Along - Advanced', duration: '15 mins', level: 'Advanced', image: require('@/assets/images/follow_along.jpg') },
];

const featuredWorkouts: FeaturedWorkout[] = [
    {
      title: 'MASSIVE UPPER BODY',
      description: 'Build strength and endurance with this comprehensive upper body workout designed specifically for wheelchair users.',
      image: require('@/assets/images/wheelchairman.png'),
      duration: '25 mins',
      level: 'Intermediate',
      equipment: 'Resistance bands, Dumbbells (optional)',
      intensity: 'High',
      exercises: [
        'Seated Shoulder Press',
        'Tricep Extensions',
        'Bicep Curls',
        'Chest Press',
        'Lateral Raises'
      ]
    },
    {
      title: 'ADAPTIVE BODY STRETCH',
      description: 'Improve flexibility and reduce muscle tension with this gentle stretching routine.',
      image: require('@/assets/images/stretch.jpg'),
      duration: '15 mins',
      level: 'Beginner',
      equipment: 'None required',
      intensity: 'Low',
      exercises: [
        'Neck Stretches',
        'Shoulder Rolls',
        'Arm Circles',
        'Trunk Twists',
        'Wrist and Hand Stretches'
      ]
    },
    {
      title: 'LEGS & CORE BLAST',
      description: 'Push your limits with this intense workout for legs and core.',
      image: require('@/assets/images/wheelchairman1.png'),
      duration: '20 mins',
      level: 'Advanced',
      equipment: 'Resistance bands, Ankle weights',
      intensity: 'High',
      exercises: [
        'Seated Leg Extensions',
        'Core Twists',
        'Hip Abductions',
        'Plank Holds',
        'Russian Twists'
      ]
    },
  ];

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [showTourGuide, setShowTourGuide] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const navigation = useNavigation<AuthNavigationProp>();
  const params = useLocalSearchParams();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = 300;
  const spacing = 10;
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll animation
  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -(cardWidth + spacing) * featuredWorkouts.length,
            duration: 19000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser) {
        try {
          const userRef = ref(db, `users/${authenticatedUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setFullName(data.fullName || "User");
            
            // Show tour guide if user hasn't seen it and is not coming from sign in
            if (!data.hasSeenTour && !params.fromSignIn) {
              setShowTourGuide(true);
            }
          } else {
            console.warn("No user data found in the database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.fromSignIn]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Redirect href="../(auth)/SplashScreen" />;
  }

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ThemedView style={styles.container}>
          <Header title="WheelFit" subtitle="Adaptive Home Workouts" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts, training videos, plans..."
            placeholderTextColor="#A9A9A9"
            onFocus={() => router.push({ pathname: '/expanded-pages/searchResults' })}
          />
          <FlatList
            data={workoutsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.workoutCard}
                onPress={() => router.push({
                  pathname: '../expanded-pages/FeaturedGuides',
                  params: { title: item.title, duration: item.duration, level: item.level, image: item.image }
                })}
              >
                <Image source={item.image} style={styles.workoutImage} />
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutTitle}>{item.title}</Text>
                  <Text style={styles.workoutSubtitle}>
                    {item.duration} • {item.level}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <>
                <Text style={styles.welcomeText}>Welcome, {fullName}!</Text>
                <Text style={styles.sectionTitle}>Featured Workouts</Text>
                <View style={styles.featuredContainer}>
                  <Animated.View
                    style={{
                      flexDirection: 'row',
                      transform: [{ translateX: scrollX }],
                    }}
                  >
                    {featuredWorkouts.map((item, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.featuredCard}
                        onPress={() => router.push({
                          pathname: '../expanded-pages/FeaturedGuides',
                          params: {
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            duration: item.duration,
                            level: item.level,
                            equipment: item.equipment,
                            intensity: item.intensity,
                            exercises: JSON.stringify(item.exercises)
                          }
                        })}
                      >
                        <Image source={item.image} style={styles.featuredImage} />
                        <Text style={styles.featuredText}>{item.title}</Text>
                        <Text style={styles.featuredDesc}>{item.description}</Text>
                        <TouchableOpacity style={styles.startButton}>
                          <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                    {/* Duplicate cards for seamless loop */}
                    {featuredWorkouts.map((item, index) => (
                      <TouchableOpacity 
                        key={`duplicate-${index}`}
                        style={styles.featuredCard}
                        onPress={() => router.push({
                          pathname: '../expanded-pages/FeaturedGuides',
                          params: {
                            title: item.title,
                            description: item.description,
                            image: item.image,
                            duration: item.duration,
                            level: item.level,
                            equipment: item.equipment,
                            intensity: item.intensity,
                            exercises: JSON.stringify(item.exercises)
                          }
                        })}
                      >
                        <Image source={item.image} style={styles.featuredImage} />
                        <Text style={styles.featuredText}>{item.title}</Text>
                        <Text style={styles.featuredDesc}>{item.description}</Text>
                        <TouchableOpacity style={styles.startButton}>
                          <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                </View>
                <Text style={[styles.sectionTitle, styles.quickStartTitle]}>QUICK START</Text>
                <Text style={styles.classicText}>Classic Workouts</Text>
                <View style={styles.filterContainer}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[styles.filterBadge, selectedLevel === level && styles.activeFilter]}
                      onPress={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    >
                      <Text style={styles.filterBadgeText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            }
            contentContainerStyle={styles.workoutsList}
          />
        </ThemedView>
      </SafeAreaView>
      <TourGuide 
        visible={showTourGuide} 
        onClose={() => setShowTourGuide(false)} 
      />
    </>
  );
}

function Workouts({ fullName }: { fullName: string | null }) {
  const navigation = useNavigation<AuthNavigationProp>();
  const colorScheme = useColorScheme();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = 300;
  const spacing = 10;

  const filteredWorkouts = selectedLevel
    ? workoutsData.filter(workout => workout.level === selectedLevel)
    : workoutsData;

  // Create a single animation value for all cards
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll animation
  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -(cardWidth + spacing) * featuredWorkouts.length,
            duration: 19000, // 15 seconds for full cycle
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ThemedView style={styles.container}>
        <Header title="WheelFit" subtitle="Adaptive Home Workouts" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts, training videos, plans..."
          placeholderTextColor="#A9A9A9"
          onFocus={() => router.push({ pathname: '/expanded-pages/searchResults' })}
        />
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.workoutCard}
              onPress={() => router.push({
                pathname: '../expanded-pages/FeaturedGuides',
                params: { title: item.title, duration: item.duration, level: item.level, image: item.image }
              })}
            >
              <Image source={item.image} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutTitle}>{item.title}</Text>
                <Text style={styles.workoutSubtitle}>
                  {item.duration} • {item.level}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <>
              <Text style={styles.welcomeText}>Welcome, {fullName}!</Text>
              <Text style={styles.sectionTitle}>Featured Workouts</Text>
              <View style={styles.featuredContainer}>
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    transform: [{ translateX: scrollX }],
                  }}
                >
                  {featuredWorkouts.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.featuredCard}
                      onPress={() => router.push({
                        pathname: '../expanded-pages/FeaturedGuides',
                        params: {
                          title: item.title,
                          description: item.description,
                          image: item.image,
                          duration: item.duration,
                          level: item.level,
                          equipment: item.equipment,
                          intensity: item.intensity,
                          exercises: JSON.stringify(item.exercises)
                        }
                      })}
                    >
                      <Image source={item.image} style={styles.featuredImage} />
                      <Text style={styles.featuredText}>{item.title}</Text>
                      <Text style={styles.featuredDesc}>{item.description}</Text>
                      <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                  {/* Duplicate cards for seamless loop */}
                  {featuredWorkouts.map((item, index) => (
                    <TouchableOpacity 
                      key={`duplicate-${index}`}
                      style={styles.featuredCard}
                      onPress={() => router.push({
                        pathname: '../expanded-pages/FeaturedGuides',
                        params: {
                          title: item.title,
                          description: item.description,
                          image: item.image,
                          duration: item.duration,
                          level: item.level,
                          equipment: item.equipment,
                          intensity: item.intensity,
                          exercises: JSON.stringify(item.exercises)
                        }
                      })}
                    >
                      <Image source={item.image} style={styles.featuredImage} />
                      <Text style={styles.featuredText}>{item.title}</Text>
                      <Text style={styles.featuredDesc}>{item.description}</Text>
                      <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>
              <Text style={[styles.sectionTitle, styles.quickStartTitle]}>QUICK START</Text>
              <Text style={styles.classicText}>Classic Workouts</Text>
              <View style={styles.filterContainer}>
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.filterBadge, selectedLevel === level && styles.activeFilter]}
                    onPress={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  >
                    <Text style={styles.filterBadgeText}>{level}</Text>
                  </TouchableOpacity>
                ))}
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
    marginTop: -60,
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F0F0',
  },
  scrollContainer: {
    padding: 4,
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
    marginBottom: 7,
    padding: 7,
  },
  featuredContainer: {
    marginTop: 0,
    marginBottom: 10,
    padding: -1,
    overflow: 'hidden',
  },
  featuredCard: {
    backgroundColor: '#4476d8',
    borderRadius: 15,
    padding: 10,
    width: 300,
    marginRight: 10,
  },
  featuredImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  featuredText: {
    marginTop: 12,
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
    // color: '#333',
    margin: 1,
    fontSize: 15,
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginTop: 0,
    padding: 10,
  },
  activeFilter: {
    backgroundColor: '#007BFF', // Change to your theme color
    borderColor: '#007AFF',
  },
  filterBadge: {
    backgroundColor: '#FFF',
    color: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 16,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: -1,
  },
  filterBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
    // color: '#333',
    marginTop: -10,
    marginBottom: -5,
    textAlign: 'left',
    padding: 8,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
    // color: '#333',
    marginTop: -10,
    marginBottom: -5,
    textAlign: 'left',
    padding: 6,
  },
});