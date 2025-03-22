import axios from "axios";

// Define Exercise type
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  gifUrl: string;
  target: string;
  equipment: string;
  instructions: string[]; 
}

// API Base URL
const API_URL = "https://exercisedb.p.rapidapi.com";

// Store API key securely
const API_KEY = process.env.EXERCISE_DB_API_KEY || "8535a97e5emsh556dd2eed6bfafcp16c074jsne181df92a374";

// Axios client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    "X-RapidAPI-Key": API_KEY,
    "Content-Type": "application/json",
  },
});

// ✅ Adaptive Filtering Logic
const filterAdaptiveExercises = (exercises: Exercise[]): Exercise[] => {
  const excludedEquipment = ["sled", "smith machine"];
  const allowedTargets = ["chest", "shoulders", "triceps", "biceps", "upper back", "abs"];
  const excludedKeywords = ["squat", "standing", "deadlift", "lunge", "jump"];

  return exercises.filter((exercise) => {
    // Exclude if it requires certain equipment
    if (excludedEquipment.includes(exercise.equipment.toLowerCase())) return false;

    // Exclude if it's targeting lower-body muscles
    if (!allowedTargets.includes(exercise.target.toLowerCase())) return false;

    // Exclude if the name contains standing-based keywords
    if (excludedKeywords.some((keyword) => exercise.name.toLowerCase().includes(keyword))) return false;

    return true; // If all checks pass, include the exercise
  });
};

// Fetch exercises by body part and filter adaptive ones
export const getAdaptiveExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>(`/exercises/bodyPart/${bodyPart}`);
    const adaptiveExercises = filterAdaptiveExercises(response.data);
    return adaptiveExercises;
  } catch (error) {
    console.error("Error fetching adaptive exercises:", error);
    return [];
  }
};