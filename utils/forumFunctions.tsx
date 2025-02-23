import { db, ref, push, onValue, auth, get } from "@/firebaseConfig";
import { User } from "firebase/auth";

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

  onValue(postsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const postsArray = Object.keys(data).map((key) => ({
        id: key,
        type: 'post', // Add this to match the Post interface
        ...data[key],
      }));
      console.log("Fetched posts:", postsArray); // Debugging
      callback(postsArray);
    } else {
      console.log("No posts found."); // Debugging
      callback([]);
    }
  });
};