import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

const workoutsData = [
  {
    title: 'Abs - Intermediate',
    duration: '25 mins',
    level: 'Intermediate',
    image: require('@/assets/images/abs.png'), 
  },
  {
    title: 'Chest - Easy',
    duration: '15 mins',
    level: 'Beginner',
    image: require('@/assets/images/chest.png'), 
  },
  {
    title: 'Shoulder & Back - Intermediate',
    duration: '15 mins',
    level: 'Intermediate',
    image: require('@/assets/images/shoulder_back.png'), 
  },
  {
    title: 'Arms - Intermediate',
    duration: '15 mins',
    level: 'Intermediate',
    image: require('@/assets/images/arms.png'), 
  },
  {
    title: 'Follow Along - Advanced',
    duration: '15 mins',
    level: 'Advanced',
    image: require('@/assets/images/arms.png'), 
  },
];

export default function WorkoutsScreen() {
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>WheelFit</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts, plans..."
          placeholderTextColor="#A9A9A9"
        />
      </View>
      <ThemedText type="title" style={styles.sectionTitle}>
        Featured Workouts
      </ThemedText>
      <View style={styles.featuredContainer}>
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={require('@/assets/images/featured_workout.png')} 
            style={styles.featuredImage}
          />
          <Text style={styles.featuredText}>MASSIVE UPPER BODY</Text>
          <Text style={styles.featuredDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={styles.quickStartContainer}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Beginner</Text>
          <Text style={styles.filterText}>Intermediate</Text>
          <Text style={styles.filterText}>Advanced</Text>
        </View>
        <FlatList
          data={workoutsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWorkout}
          style={styles.workoutsList}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  featuredContainer: {
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#E8F5FF',
    borderRadius: 8,
    padding: 16,
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
    color: '#555',
  },
  startButton: {
    marginTop: 8,
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  quickStartContainer: {
    marginTop: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  filterText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  workoutsList: {
    marginTop: 8,
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
});
