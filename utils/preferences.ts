import { ref, set, update, get } from "firebase/database";
import { db, auth } from "@/firebaseConfig"; // Import the `db` and `auth` objects from your Firebase config file

// Function to get the current authenticated user's ID
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated"); // Throw an error if the user is not authenticated
  }
  return user.uid; // Return the authenticated user's ID
};

// Function to create a new preferences entry for the current user
export const createPreferences = async () => {
  const userId = getCurrentUserId(); // Get the authenticated user's ID
  const preferencesRef = ref(db, `preferences/${userId}`); // Use the `db` object
  await set(preferencesRef, {
    goal: null,
    gender: null,
    limitation: null,
    age: null,
    weight: null,
    height: null,
    preference: null,
  });
};

// Function to update a specific field in the preferences table for the current user
export const updatePreferences = async (
  field: string,
  value: string | number | null
) => {
  const userId = getCurrentUserId(); // Get the authenticated user's ID
  const preferencesRef = ref(db, `preferences/${userId}`); // Use the `db` object
  await update(preferencesRef, { [field]: value });
};

// Function to fetch the current user's preferences
export const getPreferences = async () => {
  const userId = getCurrentUserId(); // Get the authenticated user's ID
  const preferencesRef = ref(db, `preferences/${userId}`); // Use the `db` object
  const snapshot = await get(preferencesRef);
  return snapshot.val();
};