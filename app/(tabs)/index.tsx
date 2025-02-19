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
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../(auth)/AppNavigation';
import { useRouter } from 'expo-router';


export default function Index() {

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AuthNavigationProp>();

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
    return <Redirect href="../(auth)/SplashScreen" />;
  }  

  return <Workouts />;
}

const workoutsData = [
  { title: 'Abs - Intermediate', duration: '25 mins', level: 'Intermediate', image: require('@/assets/images/abs.png') },
  { title: 'Chest - Easy', duration: '15 mins', level: 'Beginner', image: require('@/assets/images/chest.png') },
  { title: 'Shoulder & Back - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/shoulder_back.png') },
  { title: 'Arms - Intermediate', duration: '15 mins', level: 'Intermediate', image: require('@/assets/images/arms.png') },
  { title: 'Follow Along - Advanced', duration: '15 mins', level: 'Advanced', image: require('@/assets/images/follow_along.jpg') },
  { title: 'Full Body Stretch - Easy', duration: '15 mins', level: 'Beginner', image: require('@/assets/images/chest.png') },
  { title: 'Follow Along - Advanced', duration: '15 mins', level: 'Advanced', image: require('@/assets/images/follow_along.jpg') },
];

function Workouts() {
  const navigation = useNavigation<AuthNavigationProp>(); 
  const colorScheme = useColorScheme();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const router = useRouter();

  const filteredWorkouts = selectedLevel
    ? workoutsData.filter(workout => workout.level === selectedLevel)
    : workoutsData;




  const renderWorkout = ({ item }: any) => (
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
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ThemedView style={styles.container}>
      <Header title="WheelFit" streak="28/30" subtitle="Adaptive Home Workouts" />
      <TextInput style={styles.searchInput} placeholder="Search workouts, plans..." placeholderTextColor="#A9A9A9" />
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWorkout}
          ListHeaderComponent={
            <>
              <Text style={styles.welcomeText}>Welcome, User</Text>
              <Text style={styles.sectionTitle}>Featured Workouts</Text>
              <View style={styles.featuredContainer}>
                <FlatList
                  data={[
                    {
                      title: 'MASSIVE UPPER BODY',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                      image: require('@/assets/images/chest1.png'),
                    },
                    {
                      title: 'LEGS & CORE BLAST',
                      description: 'Push your limits with this intense workout for legs and core.',
                      image: require('@/assets/images/chest1.png'),
                    },
                    {
                      title: 'MASSIVE UPPER BODY',
                      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                      image: require('@/assets/images/chest1.png'),
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
                      <TouchableOpacity style={styles.startButton}
                      

                      onPress={() => router.push('../expanded-pages/FeaturedGuides')}>
                                            
                        <Text style={styles.startButtonText}>Start</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                />
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
    fontSize: 30,
    fontWeight: 'bold',
    // color: '#333',
    marginTop: -10,
    marginBottom: -5,
    textAlign: 'left',
    padding: 6,
  },
});
