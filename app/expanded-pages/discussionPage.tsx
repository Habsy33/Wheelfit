import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Share,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { formatRelativeTime } from '@/utils/dateUtils';

interface PostParams {
  id: string;
  title: string;
  author: string;
  views: string;
  likes: string;
  comments: string;
  content: string;
  tags: string;
  profileImageUrl?: string;
  timestamp: string;
}

const DiscussionPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const typedParams = {
    id: params.id as string,
    title: params.title as string,
    author: params.author as string,
    views: params.views as string,
    likes: params.likes as string,
    comments: params.comments as string,
    content: params.content as string,
    tags: params.tags as string,
    profileImageUrl: params.profileImageUrl as string,
    timestamp: params.timestamp as string,
  };
  const [comments, setComments] = useState([
    { 
      id: '1', 
      author: 'Jane Smith', 
      text: 'Great discussion! I totally agree with your points.',
      timestamp: '2 hours ago',
      likes: 5,
      isLiked: false,
      profileImageUrl: null,
    },
    { 
      id: '2', 
      author: 'Mike Johnson', 
      text: "I've been doing resistance band workouts too!",
      timestamp: '1 hour ago',
      likes: 3,
      isLiked: false,
      profileImageUrl: null,
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(Number(typedParams.likes));

  const addComment = () => {
    if (newComment.trim().length === 0) return;
    const newCommentObj = {
      id: (comments.length + 1).toString(),
      author: 'You',
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      profileImageUrl: null,
    };
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const togglePostLike = () => {
    setIsPostLiked(!isPostLiked);
    setPostLikes(prev => isPostLiked ? prev - 1 : prev + 1);
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post on WheelFit: ${typedParams.title}`,
        title: 'Share on WheelFit'
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="WheelFit Forum" subtitle="Adaptive Fitness Discussions" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/forum')}
        accessibilityLabel="Back to forum"
        accessibilityHint="Double tap to return to the forum page"
      >
        <MaterialIcons name="arrow-back" size={24} color="#005CEE" />
        <Text style={styles.backButtonText}>Back to Forum</Text>
      </TouchableOpacity>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.postContainer}>
            <Text style={styles.title}>{typedParams.title}</Text>
            <View style={styles.metaContainer}>
              <Image
                source={
                  typedParams.profileImageUrl
                    ? { uri: typedParams.profileImageUrl }
                    : require('@/assets/images/profile_pic.png')
                }
                style={styles.authorImage}
              />
              <View style={styles.metaInfo}>
                <View style={styles.authorDetails}>
                  <Text style={styles.meta}>By {typedParams.author}</Text>
                  <Text style={styles.timeStamp}>{formatRelativeTime(Number(typedParams.timestamp))}</Text>
                </View>
                <Text style={styles.meta}>•</Text>
                <Text style={styles.meta}>{typedParams.views} Views</Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {typedParams.tags && JSON.parse(typedParams.tags).map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.content}>
              {typedParams.content}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.iconButton, isPostLiked && styles.activeIconButton]} 
                onPress={togglePostLike}
              >
                <FontAwesome 
                  name={isPostLiked ? "thumbs-up" : "thumbs-o-up"} 
                  size={20} 
                  color={isPostLiked ? "#4CAF50" : "#666"} 
                />
                <Text style={[styles.iconText, isPostLiked && styles.activeIconText]}>
                  {postLikes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="thumbs-o-down" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="comment-o" size={20} color="#666" />
                <Text style={styles.iconText}>{typedParams.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <MaterialIcons name="share" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.commentHeader}>Comments ({comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.commentHeaderRow}>
              <View style={styles.commentAuthorContainer}>
                <Image
                  source={
                    item.profileImageUrl
                      ? { uri: item.profileImageUrl }
                      : require('@/assets/images/profile_pic.png')
                  }
                  style={styles.commentAuthorImage}
                />
                <View>
                  <Text style={styles.commentAuthor}>{item.author}</Text>
                  <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity 
                style={[styles.commentIconButton, item.isLiked && styles.activeIconButton]}
                onPress={() => toggleCommentLike(item.id)}
              >
                <FontAwesome 
                  name={item.isLiked ? "thumbs-up" : "thumbs-o-up"} 
                  size={16} 
                  color={item.isLiked ? "#4CAF50" : "#666"} 
                />
                <Text style={[styles.commentIconText, item.isLiked && styles.activeIconText]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentIconButton}>
                <FontAwesome name="reply" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={[styles.button, !newComment.trim() && styles.disabledButton]} 
              onPress={addComment}
              disabled={!newComment.trim()}
            >
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', marginTop: -50 },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 13,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#333'
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  meta: { 
    color: '#666', 
    fontSize: 14,
    marginRight: 4
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e6f4ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#005CEE',
  },
  content: { 
    fontSize: 16, 
    marginBottom: 20, 
    color: '#333',
    lineHeight: 24
  },
  actions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12
  },
  iconButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 20,
    padding: 8
  },
  activeIconButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
  },
  iconText: { 
    marginLeft: 4, 
    fontSize: 14, 
    color: '#666' 
  },
  activeIconText: {
    color: '#4CAF50'
  },
  commentHeader: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: '#333'
  },
  comment: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentAuthor: { 
    fontWeight: 'bold', 
    fontSize: 14,
    color: '#333'
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666'
  },
  commentText: { 
    fontSize: 14, 
    color: '#333',
    marginBottom: 8,
    lineHeight: 20
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 8,
    marginTop: 4
  },
  commentIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 4
  },
  commentIconText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: { 
    flex: 1, 
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100
  },
  button: { 
    backgroundColor: '#005CEE', 
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 8,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#005CEE',
    fontWeight: '400',
  },
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorDetails: {
    flex: 1,
  },
  timeStamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default DiscussionPage;
