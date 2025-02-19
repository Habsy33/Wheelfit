import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { FontAwesome } from '@expo/vector-icons';

const DiscussionPage: React.FC = () => {
  const { title, author, views, likes, comments: commentCount } = useLocalSearchParams();
  const [comments, setComments] = useState([
    { id: '1', author: 'Jane Smith', text: 'Great discussion! I totally agree with your points.' },
    { id: '2', author: 'Mike Johnson', text: 'I’ve been doing resistance band workouts too!' },
  ]);
  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim().length === 0) return;
    const newCommentObj = {
      id: (comments.length + 1).toString(),
      author: 'You',
      text: newComment,
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <View style={styles.container}>
      <Header title="WheelFit Forum" streak="28/30" subtitle="Adaptive Fitness Discussions" />

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.postContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.meta}>By {author} • {views} Views</Text>
            <Text style={styles.content}>
              This is where the expanded post content will go. More details about the discussion topic can be added here.
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="thumbs-up" size={20} color="#4CAF50" />
                <Text style={styles.iconText}>{likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="thumbs-down" size={20} color="#F44336" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="comment" size={20} color="#2196F3" />
                <Text style={styles.iconText}>{commentCount}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentHeader}>Comments</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.button} onPress={addComment}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', marginTop: -50, },
  scrollContainer: { padding: 15 },
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  meta: { color: '#666', fontSize: 14, marginBottom: 10, marginTop: -35, },
  content: { fontSize: 16, marginBottom: 20, color: '#333', marginTop: 10, },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20, },
  iconButton: { marginLeft: 10, flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  iconText: { marginLeft: -4, fontSize: 16, color: '#333' },
  commentHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  comment: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  commentAuthor: { fontWeight: 'bold', fontSize: 14, marginBottom: 3 },
  commentText: { fontSize: 14, color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 20,
  },
  input: { flex: 1, padding: 10, fontSize: 14, color: '#333' },
  button: { marginLeft: 10, backgroundColor: '#005CEE', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DiscussionPage;
