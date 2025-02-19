import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/Header'; // Importing the Header component
import { useRouter } from 'expo-router';

// Define types for the items in the FlatList
interface Post {
  id: string;
  type: 'post';
  title: string;
  tags: string[];
  views: string;
  likes: string;
  comments: string;
  author: string;
}

interface Meetup {
  id: string;
  type: 'meetup';
  date: string;
  title: string;
  location: string;
  format: string;
}

interface SearchItem {
  id: string;
  type: 'search';
}

interface FilterItem {
  id: string;
  type: 'filters';
}

interface CreatePostItem {
  id: string;
  type: 'createPost';
}

interface HeaderItem {
  id: string;
  type: 'header';
}

type ForumItem = Post | Meetup | SearchItem | FilterItem | CreatePostItem | HeaderItem;

const Forum: React.FC = () => {
  const router = useRouter();

  const posts: Post[] = [
    {
      id: '1',
      type: 'post',
      title: "Conquering Home Workouts: What's in Your Routine?",
      tags: ['wheelchair', 'fitness', 'daily exercise'],
      views: '651,324 Views',
      likes: '36,645 Likes',
      comments: '56 Comments',
      author: 'John Doe',
    },
    {
      id: '2',
      type: 'post',
      title: 'Tackling Upper-Body Strength: My Progress with Resistance Bands!',
      tags: ['resistance bands', 'upper body', 'progress update'],
      views: '244,568 Views',
      likes: '10,920 Likes',
      comments: '134 Comments',
      author: 'Jane Smith',
    },
  ];

  const meetups: Meetup[] = [
    {
      id: '3',
      type: 'meetup',
      date: 'APR 25',
      title: 'Technogym MOVES 2025 Challenge',
      location: 'Technogym, Glasgow Club, Scotland',
      format: 'Remote / Workshop',
    },
    {
      id: '4',
      type: 'meetup',
      date: 'JUL 13',
      title: 'SDS Summer Camp 2025',
      location: 'Scottish Disability Sport, Scotland, United Kingdom',
      format: 'In Person',
    },
    {
      id: '5',
      type: 'meetup',
      date: 'JUL 13',
      title: 'SDS Summer Camp 2025',
      location: 'Scottish Disability Sport, Scotland, United Kingdom',
      format: 'In Person',
    },
    {
      id: '6',
      type: 'meetup',
      date: 'JUL 13',
      title: 'SDS Summer Camp 2025',
      location: 'Scottish Disability Sport, Scotland, United Kingdom',
      format: 'In Person',
    },
  ];

  const combinedData: ForumItem[] = [
    { id: 'search', type: 'search' },
    { id: 'filters', type: 'filters' },
    { id: 'createPost', type: 'createPost' },
    ...posts,
    { id: 'meetupsHeader', type: 'header' },
    ...meetups,
  ];

  const renderItem: ListRenderItem<ForumItem> = ({ item }) => {
    switch (item.type) {
      case 'search':
        return (
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search forum..."
              placeholderTextColor="#999"
            />
          </View>
        );
      case 'filters':
        return (
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
        );
      case 'createPost':
        return (
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
        );
      case 'post':
        return (
          <TouchableOpacity style={styles.postContainer} onPress={() => router.push(`../expanded-pages/discussionPage?id=${item.id}`)}>
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
          </TouchableOpacity>
        );
      case 'header':
        return <Text style={styles.meetupsHeader}>Meetups →</Text>;
      case 'meetup':
        return (
          <TouchableOpacity
            onPress={() => router.push(`/expanded-pages/MeetupsPage?id=${item.id}&date=${item.date}&title=${item.title}&location=${item.location}&format=${item.format}`)}
          >
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
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Wrap Header component in a container to adjust position */}
      <View style={styles.headerWrapper}>
        <Header
          streak="28/30"
          title="WheelFit"
          subtitle="Adaptive Fitness Forum"
        />
      </View>
      <FlatList
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    paddingBottom: 16,
    marginTop: 1,
  },
  headerWrapper: {
    position: 'relative', // Allows adjustment of header position if needed
    marginBottom: -5, // You can adjust this for spacing
    marginTop: -50,
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
  meetupsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 8,
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
