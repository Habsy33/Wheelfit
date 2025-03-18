// eventsTracking.ts
import { db, ref, push, auth, get, onValue } from "@/firebaseConfig";
import { remove } from "firebase/database";
import { User } from "firebase/auth";

export interface EventTrackingData {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventDescription: string;
  signedUpBy: string;
  userId: string;
  timestamp: number;
}

export const trackEventSignUp = async (
  eventName: string,
  eventDate: string,
  eventDescription: string
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

  // Create the event tracking entry
  const eventsTrackingRef = ref(db, "eventsTracking");
  const newEventTracking = {
    eventName,
    eventDate,
    eventDescription,
    signedUpBy: username, // Use the fetched username
    userId: user.uid,
    timestamp: Date.now(),
  };

  try {
    await push(eventsTrackingRef, newEventTracking);
    console.log("Event sign-up tracked successfully!");
  } catch (error) {
    console.error("Error tracking event sign-up:", error);
  }
};

export const fetchEventsTracking = (callback: (events: EventTrackingData[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const eventsTrackingRef = ref(db, "eventsTracking");
  onValue(eventsTrackingRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const eventsArray = Object.keys(data)
        .map((key) => ({
          eventId: key,
          ...data[key],
        }))
        .filter((event) => event.userId === user.uid); // Filter events for the current user
      console.log("Fetched events:", eventsArray);
      callback(eventsArray);
    } else {
      console.log("No events found.");
      callback([]);
    }
  });
};

export const deleteEventTracking = async (eventId: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const eventRef = ref(db, `eventsTracking/${eventId}`);
  
  try {
    // First verify the event belongs to the current user
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const eventData = snapshot.val();
      if (eventData.userId === user.uid) {
        await remove(eventRef);
        console.log("Event deleted successfully!");
      } else {
        console.error("Unauthorized: Cannot delete event that doesn't belong to user");
      }
    } else {
      console.error("Event not found");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};