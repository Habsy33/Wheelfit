import { db, ref, push, onValue, auth, get, update, remove } from "@/firebaseConfig";
import { User } from "firebase/auth";

interface Post {
  id: string;
  type: 'post';
  title: string;
  content: string;
  tags: string[];
  author: string;
  userId?: string;
  likes: number;
  comments: number;
  timestamp: number;
  views: number;
  profileImageUrl?: string;
}

export const createPost = async (title: string, content: string, tags: string[]) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }

  // Fetch the username from the users table
  const userRef = ref(db, `users/${user.uid}`);
  let username = "Anonymous"; // Default value if username is not found

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      username = userData.username || "Anonymous"; // Use the username from the users table
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Create the new post with the fetched username
  const postRef = ref(db, "forumPosts");
  const newPost = {
    title,
    content,
    tags,
    author: '@' + username, // Use the fetched username
    userId: user.uid,
    timestamp: Date.now(),
    likes: 0,
    comments: 0,
    views: 0, // Add initial views count
  };

  try {
    await push(postRef, newPost);
    console.log("Post added successfully!");
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

export const fetchForumPosts = (callback: (posts: Post[]) => void) => {
  const postsRef = ref(db, "forumPosts");

  onValue(postsRef, async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const postsArray = await Promise.all(
        Object.keys(data).map(async (key) => {
          const post = data[key];
          // Fetch user's profile image if userId exists
          if (post.userId) {
            const userRef = ref(db, `users/${post.userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.val();
              return {
                id: key,
                type: 'post',
                ...post,
                profileImageUrl: userData.profileImageUrl || null,
              };
            }
          }
          return {
            id: key,
            type: 'post',
            ...post,
            profileImageUrl: null,
          };
        })
      );
      callback(postsArray);
    } else {
      callback([]);
    }
  });
};

export const deletePost = async (postId: string) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the post data to verify ownership
  const postRef = ref(db, `forumPosts/${postId}`);
  const snapshot = await get(postRef);
  
  if (!snapshot.exists()) {
    throw new Error("Post not found");
  }

  const postData = snapshot.val();
  if (postData.userId !== user.uid) {
    throw new Error("Unauthorized: You can only delete your own posts");
  }

  // Delete the post
  try {
    await remove(postRef);
    console.log("Post deleted successfully!");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const editPost = async (postId: string, newTitle: string, newContent: string, newTags: string[]) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the post data to verify ownership
  const postRef = ref(db, `forumPosts/${postId}`);
  const snapshot = await get(postRef);
  
  if (!snapshot.exists()) {
    throw new Error("Post not found");
  }

  const postData = snapshot.val();
  if (postData.userId !== user.uid) {
    throw new Error("Unauthorized: You can only edit your own posts");
  }

  // Update the post
  const updates = {
    title: newTitle,
    content: newContent,
    tags: newTags,
    lastEdited: Date.now(), // Add timestamp for when the post was last edited
  };

  try {
    await update(postRef, updates);
    console.log("Post updated successfully!");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};