// fitnessTracker.ts
import { db, ref, push, auth, get, onValue } from "@/firebaseConfig";
import { remove } from "firebase/database";
import { User } from "firebase/auth";

// Define the structure of the exercise tracking data
export interface ExerciseTrackingData {
  username: string;
  userId: string;
  exerciseId: string;  // This is the internal exercise ID (like "0049")
  firebaseId?: string; // This is the Firebase key (like "-OKbq0RbeBV-BkRAUjzX")
  exerciseName: string;
  bodyPart: string;
  target: string;
  equipment: string;
  detailRating: number;
  easeRating: number;
  timestamp: number;
}

// Function to save exercise tracking data to Firebase
export const saveExerciseTracking = async (
  exercise: ExerciseTrackingData
) => {
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

  // Add the username and user ID to the exercise tracking data
  exercise.username = username;
  exercise.userId = user.uid;

  // Save the exercise tracking data to Firebase
  const exerciseTrackingRef = ref(db, "exerciseTracking");
  try {
    await push(exerciseTrackingRef, exercise);
    console.log("Exercise tracking data saved successfully!");
  } catch (error) {
    console.error("Error saving exercise tracking data:", error);
  }
};

// Function to fetch exercise tracking data for the current user
export const fetchExerciseTracking = (callback: (data: ExerciseTrackingData[]) => void) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const exerciseTrackingRef = ref(db, "exerciseTracking");
  onValue(exerciseTrackingRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const exerciseTrackingArray = Object.keys(data)
        .map((key) => ({
          firebaseId: key,  // Store the Firebase key
          ...data[key],
        }))
        .filter((item) => item.userId === user.uid); // Filter data for the current user
      console.log("Fetched exercise tracking data:", exerciseTrackingArray);
      callback(exerciseTrackingArray);
    } else {
      console.log("No exercise tracking data found.");
      callback([]);
    }
  });
};

// Function to delete an exercise tracking entry
export const deleteExerciseTracking = async (firebaseId: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const exerciseRef = ref(db, `exerciseTracking/${firebaseId}`);
  
  try {
    // First verify the exercise belongs to the current user
    const snapshot = await get(exerciseRef);
    if (snapshot.exists()) {
      const exerciseData = snapshot.val();
      if (exerciseData.userId === user.uid) {
        await remove(exerciseRef);
        console.log("Exercise deleted successfully!");
      } else {
        console.error("Unauthorized: Cannot delete exercise that doesn't belong to user");
      }
    } else {
      console.error("Exercise not found");
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }
};