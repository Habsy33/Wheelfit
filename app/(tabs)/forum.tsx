import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Share,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/Header'; // Importing the Header component
import { useRouter } from 'expo-router';
import { createPost, fetchForumPosts, deletePost, editPost } from '@/utils/forumFunctions';
import { auth } from '@/firebaseConfig';
import { formatRelativeTime } from '@/utils/dateUtils';

// Define types for the items in the FlatList
interface Post {
  id: string;
  type: 'post';
  title: string;
  views: number;
  content: string; // Add this
  tags: string[];
  author: string;
  likes: number; // Change from string to number
  comments: number; // Change from string to number
  timestamp: number; // Add this
  userId?: string; // Add this (optional)
  profileImageUrl?: string; // Add this (optional)
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

interface ShowMoreItem {
  id: string;
  type: 'showMore';
}

type ForumItem = Post | Meetup | SearchItem | FilterItem | CreatePostItem | HeaderItem | ShowMoreItem;

const Forum: React.FC = () => {
  const router = useRouter();
  const [forumPosts, setForumPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'newest' | 'popular' | 'following'>('newest');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const INITIAL_POSTS_TO_SHOW = 2; // Number of posts to show initially
  const [postLikes, setPostLikes] = useState<{ [key: string]: number }>({});

  // Fetch posts from the database on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        await fetchForumPosts(setForumPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  // Sort posts by timestamp (most recent first) and then filter based on search query
  const filteredPosts = forumPosts
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first
    .filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Get limited or full list of posts based on showAllPosts state
  const displayedPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, INITIAL_POSTS_TO_SHOW);

  // Handle creating a new post with validation
  const handleCreatePost = async () => {
    const trimmedTitle = newPostTitle.trim();
    const trimmedContent = newPostContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      Alert.alert('Invalid Input', 'Please enter both a title and content for your post.');
      return;
    }

    try {
      setIsLoading(true);
      await createPost(trimmedTitle, trimmedContent, newPostTags);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags([]);
      setIsCreatePostModalVisible(false);
      await fetchForumPosts(setForumPosts);
    } catch (err) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !newPostTags.includes(trimmedTag)) {
      setNewPostTags([...newPostTags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPostTags(newPostTags.filter(tag => tag !== tagToRemove));
  };

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
      date: 'APR 25',
      title: 'Technogym MOVES 2025 Challenge',
      location: 'Technogym, Glasgow Club, Scotland',
      format: 'Remote / Workshop',
    },
  ];

  // Combine all data for the FlatList
  const combinedData: ForumItem[] = [
    { id: 'search', type: 'search' },
    { id: 'filters', type: 'filters' },
    { id: 'createPost', type: 'createPost' },
    ...displayedPosts,
    ...(filteredPosts.length > INITIAL_POSTS_TO_SHOW && !showAllPosts ? [{ id: 'showMore', type: 'showMore' as const }] : []),
    { id: 'meetupsHeader', type: 'header' },
    ...meetups,
  ];

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await deletePost(postId);
              await fetchForumPosts(setForumPosts);
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete post');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditPost = async () => {
    if (!editingPost) return;

    try {
      setIsLoading(true);
      await editPost(editingPost.id, editTitle, editContent, editingPost.tags);
      setEditingPost(null);
      await fetchForumPosts(setForumPosts);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (postId: string, currentLikes: number) => {
    setPostLikes(prev => ({
      ...prev,
      [postId]: (prev[postId] || currentLikes) + 1
    }));
  };

  const handleDislike = (postId: string, currentLikes: number) => {
    setPostLikes(prev => ({
      ...prev,
      [postId]: (prev[postId] || currentLikes) - 1
    }));
  };

  const handleShare = async (title: string) => {
    try {
      await Share.share({
        message: `Check out this post on WheelFit: ${title}`,
        title: 'Share on WheelFit'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Render each item in the FlatList
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search forum posts"
              accessibilityHint="Enter text to search forum posts"
            />
          </View>
        );
      case 'filters':
        return (
          <View style={styles.filters}>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                activeFilter === 'newest' && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter('newest')}
            >
              <MaterialIcons 
                name="fiber-new" 
                size={20} 
                color={activeFilter === 'newest' ? '#fff' : '#005CEE'} 
              />
              <Text style={[
                styles.filterText,
                activeFilter === 'newest' && styles.activeFilterText
              ]}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                activeFilter === 'popular' && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter('popular')}
            >
              <FontAwesome 
                name="fire" 
                size={20} 
                color={activeFilter === 'popular' ? '#fff' : '#FF4500'} 
              />
              <Text style={[
                styles.filterText,
                activeFilter === 'popular' && styles.activeFilterText
              ]}>Popular</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterButton,
                activeFilter === 'following' && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter('following')}
            >
              <MaterialIcons 
                name="people" 
                size={20} 
                color={activeFilter === 'following' ? '#fff' : '#F9A825'} 
              />
              <Text style={[
                styles.filterText,
                activeFilter === 'following' && styles.activeFilterText
              ]}>Following</Text>
            </TouchableOpacity>
          </View>
        );
      case 'createPost':
        return (
          <View style={styles.createPost}>
            <TouchableOpacity 
              style={styles.createPostButton}
              onPress={() => setIsCreatePostModalVisible(true)}
              accessibilityLabel="Create new post"
              accessibilityHint="Double tap to open create post form"
            >
              <View style={styles.createPostButtonContent}>
                <MaterialIcons name="edit" size={24} color="#fff" />
                <Text style={styles.createPostButtonText}>Create New Post</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'post':
        const isCurrentUserPost = auth.currentUser?.uid === item.userId;
        return (
          <TouchableOpacity 
            style={styles.postContainer} 
            onPress={() => router.push({
              pathname: '../expanded-pages/discussionPage',
              params: {
                id: item.id,
                title: item.title,
                author: item.author,
                views: item.views,
                likes: postLikes[item.id] || item.likes,
                comments: item.comments,
                content: item.content,
                tags: JSON.stringify(item.tags),
                profileImageUrl: item.profileImageUrl || null,
                timestamp: item.timestamp
              }
            })}
            accessibilityLabel={`Post: ${item.title}`}
            accessibilityHint="Double tap to view full post"
          >
            <View style={styles.postContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postPreview} numberOfLines={2}>
                {item.content}
              </Text>
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.postFooter}>
                <View style={styles.authorInfo}>
                  <Image
                    source={
                      item.profileImageUrl
                        ? { uri: item.profileImageUrl }
                        : require('@/assets/images/profile_pic.png')
                    }
                    style={styles.authorImage}
                  />
                  <View style={styles.postMetaContainer}>
                    <Text style={styles.postMeta}>
                      {item.author} • {postLikes[item.id] || item.likes} likes • {item.comments} comments
                    </Text>
                    <Text style={styles.timeStamp}>{formatRelativeTime(item.timestamp)}</Text>
                  </View>
                </View>
                {isCurrentUserPost ? (
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingPost(item);
                        setEditTitle(item.title);
                        setEditContent(item.content);
                      }}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#005CEE" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePost(item.id)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLike(item.id, item.likes);
                      }}
                      style={styles.actionButton}
                    >
                      <FontAwesome name="thumbs-o-up" size={20} color="#005CEE" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDislike(item.id, item.likes);
                      }}
                      style={styles.actionButton}
                    >
                      <FontAwesome name="thumbs-o-down" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleShare(item.title);
                      }}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="share" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
      case 'showMore':
        return (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => setShowAllPosts(true)}
            accessibilityLabel="Show more posts"
            accessibilityHint="Double tap to show all forum posts"
          >
            <Text style={styles.showMoreText}>
              Show More Posts ({filteredPosts.length - INITIAL_POSTS_TO_SHOW} more)...
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchForumPosts(setForumPosts)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Wrap Header component in a container to adjust position */}
      <View style={styles.headerWrapper}>
        <Header
          title="WheelFit"
          subtitle="Adaptive Fitness Forum"
        />
      </View>
      {isLoading && !forumPosts.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#005CEE" />
        </View>
      ) : (
        <FlatList
          data={combinedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}
        />
      )}
      <Modal
        visible={editingPost !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingPost(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TextInput
              style={[styles.createPostInput, styles.modalInput]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.createPostInput, styles.modalInput, styles.contentInput]}
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Content"
              placeholderTextColor="#999"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingPost(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditPost}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isCreatePostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreatePostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <TouchableOpacity
                onPress={() => setIsCreatePostModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.createPostInput, styles.modalInput]}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              placeholder="Enter post title"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={[styles.createPostInput, styles.modalInput, styles.contentInput]}
              value={newPostContent}
              onChangeText={setNewPostContent}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={false}
            />

            <View style={styles.tagsSection}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tagsInputContainer}>
                <TextInput
                  style={[styles.createPostInput, styles.tagInput]}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add a tag"
                  placeholderTextColor="#999"
                  onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={handleAddTag}
                >
                  <MaterialIcons name="add" size={24} color="#005CEE" />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsList}>
                {newPostTags.map((tag, index) => (
                  <View key={index} style={styles.tagContainer}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.removeTagButton}
                    >
                      <MaterialIcons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsCreatePostModalVisible(false);
                  setNewPostTitle("");
                  setNewPostContent("");
                  setNewPostTags([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  (!newPostTitle.trim() || !newPostContent.trim()) && styles.disabledButton
                ]}
                onPress={handleCreatePost}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Creating...' : 'Create Post'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    paddingBottom: 100,
    marginTop: 1,
  },
  headerWrapper: {
    marginTop: -60,
    marginBottom: -5,
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
    padding: 8,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: '#005CEE',
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  createPost: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createPostButton: {
    backgroundColor: '#005CEE',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createPostButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postMetaContainer: {
    flex: 1,
  },
  postMeta: {
    fontSize: 12,
    color: '#666',
  },
  timeStamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  meetupsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  meetupContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#005CEE',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  postPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  showMoreButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  showMoreText: {
    color: '#005CEE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  createPostInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#333',
  },
  modalInput: {
    marginBottom: 16,
    height: 50,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  saveButton: {
    backgroundColor: '#005CEE',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  postActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
    height: 40,
  },
  addTagButton: {
    padding: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  removeTagButton: {
    marginLeft: 6,
    padding: 2,
  },
});

export default Forum;
