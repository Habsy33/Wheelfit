import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Forum = () => {
  const posts = [
    {
      id: '1',
      title: "Conquering Home Workouts: What's in Your Routine?",
      tags: ['wheelchair', 'fitness', 'daily exercise'],
      views: '651,324 Views',
      likes: '36,645 Likes',
      comments: '56 Comments',
      author: 'John Doe',
    },
    {
      id: '2',
      title: 'Tackling Upper-Body Strength: My Progress with Resistance Bands!',
      tags: ['resistance bands', 'upper body', 'progress update'],
      views: '244,568 Views',
      likes: '10,920 Likes',
      comments: '134 Comments',
      author: 'Jane Smith',
    },
  ];

  const meetups = [
    {
      id: '1',
      date: 'APR 25',
      title: 'Technogym MOVES 2025 Challenge',
      location: 'Technogym, Glasgow Club, Scotland',
      format: 'Remote / Workshop',
    },
    {
      id: '2',
      date: 'JUL 13',
      title: 'SDS Summer Camp 2025',
      location: 'Scottish Disability Sport, Scotland, United Kingdom',
      format: 'In Person',
    },
  ];

  const renderPost = ({ item }: { item: typeof posts[0] }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.postMeta}>
        {item.views} • {item.likes} • {item.comments}
      </Text>
    </View>
  );

  const renderMeetup = ({ item }: { item: typeof meetups[0] }) => (
    <View style={styles.meetupContainer}>
      <View style={styles.meetupDate}>
        <Text style={styles.meetupMonth}>{item.date.split(' ')[0]}</Text>
        <Text style={styles.meetupDay}>{item.date.split(' ')[1]}</Text>
      </View>
      <View style={styles.meetupInfo}>
        <Text style={styles.meetupTitle}>{item.title}</Text>
        <Text style={styles.meetupLocation}>{item.location}</Text>
        <Text style={styles.meetupFormat}>{item.format}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search forum..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="fiber-new" size={20} color="#005CEE" />
          <Text style={styles.filterText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="fire" size={20} color="#FF4500" />
          <Text style={styles.filterText}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="people" size={20} color="#F9A825" />
          <Text style={styles.filterText}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Create Post */}
      <View style={styles.createPost}>
        <TextInput
          style={styles.createPostInput}
          placeholder="Let's share what's going on..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.createPostButton}>
          <Text style={styles.createPostButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postsList}
      />

      <TouchableOpacity style={styles.seeMoreButton}>
        <Text style={styles.seeMoreText}>See more →</Text>
      </TouchableOpacity>

      {/* Meetups Section */}
      <Text style={styles.meetupsHeader}>Meetups →</Text>
      <FlatList
        data={meetups}
        renderItem={renderMeetup}
        keyExtractor={(item) => item.id}
        style={styles.meetupsList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  createPost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginRight: 8,
  },
  createPostButton: {
    backgroundColor: '#005CEE',
    padding: 12,
    borderRadius: 8,
  },
  createPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsList: {
    marginHorizontal: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e6f4ff',
    padding: 4,
    borderRadius: 8,
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#005CEE',
  },
  postMeta: {
    fontSize: 12,
    color: '#666',
  },
  seeMoreButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  seeMoreText: {
    color: '#005CEE',
    fontWeight: 'bold',
  },
  meetupsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  meetupsList: {
    marginHorizontal: 16,
  },
  meetupContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  meetupDate: {
    alignItems: 'center',
    marginRight: 16,
  },
  meetupMonth: {
    fontSize: 14,
    color: '#005CEE',
    fontWeight: 'bold',
  },
  meetupDay: {
    fontSize: 18,
    color: '#005CEE',
    fontWeight: 'bold',
  },
  meetupInfo: {
    flex: 1,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetupLocation: {
    fontSize: 12,
    color: '#666',
  },
  meetupFormat: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});

export default Forum;
