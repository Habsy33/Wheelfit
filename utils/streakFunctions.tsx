import { db, ref, get, set, auth } from "@/firebaseConfig";
import { User } from "firebase/auth";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  totalWorkouts: number;
  lastWorkoutDate: string;
  currentGoal: number;
}

const calculateNextGoal = (currentStreak: number): number => {
  let goal = 15;
  
  while (currentStreak >= goal) {
    goal += 15;
  }
  
  return goal;
};

export const initializeStreakData = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const streakRef = ref(db, `userStreaks/${userId}`);
  
  const initialData: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: today,
    totalWorkouts: 0,
    lastWorkoutDate: today,
    currentGoal: 15,
  };

  try {
    await set(streakRef, initialData);
    return initialData;
  } catch (error) {
    console.error("Error initializing streak data:", error);
    throw error;
  }
};

export const updateStreak = async (userId: string) => {
  const streakRef = ref(db, `userStreaks/${userId}`);
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const snapshot = await get(streakRef);
    
    if (!snapshot.exists()) {
      return await initializeStreakData(userId);
    }

    const streakData: StreakData = snapshot.val();
    const lastLogin = new Date(streakData.lastLoginDate);
    const currentDate = new Date(today);
    
    const diffTime = Math.abs(currentDate.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streakData.currentStreak += 1;
      if (streakData.currentStreak > streakData.longestStreak) {
        streakData.longestStreak = streakData.currentStreak;
      }
      
      streakData.currentGoal = calculateNextGoal(streakData.currentStreak);
    } else if (diffDays > 1) {
      streakData.currentStreak = 1;
      streakData.currentGoal = 15;
    }

    streakData.lastLoginDate = today;
    
    await set(streakRef, streakData);
    return streakData;
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
};

export const getStreakData = async (userId: string): Promise<StreakData | null> => {
  const streakRef = ref(db, `userStreaks/${userId}`);
  
  try {
    const snapshot = await get(streakRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching streak data:", error);
    throw error;
  }
};

export const updateWorkoutStreak = async (userId: string) => {
  const streakRef = ref(db, `userStreaks/${userId}`);
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const snapshot = await get(streakRef);
    if (!snapshot.exists()) {
      throw new Error("Streak data not found");
    }

    const streakData: StreakData = snapshot.val();
    
    if (streakData.lastWorkoutDate !== today) {
      streakData.totalWorkouts += 1;
      streakData.lastWorkoutDate = today;
      await set(streakRef, streakData);
    }
    
    return streakData;
  } catch (error) {
    console.error("Error updating workout streak:", error);
    throw error;
  }
}; 