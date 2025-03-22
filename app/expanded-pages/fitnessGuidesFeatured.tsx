// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Image, StyleSheet } from "react-native";
// import { getExercisesByBodyPart, Exercise } from "@/utils/exerciseDb";

// const FitnessGuides: React.FC = () => {
//   const [exercises, setExercises] = useState<Exercise[]>([]);
//   const bodyPart = "back"; // Change this to fetch exercises for different body parts

//   useEffect(() => {
//     const fetchExercises = async () => {
//       const data = await getExercisesByBodyPart(bodyPart);
//       setExercises(data);
//     };

//     fetchExercises();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Exercises for {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}</Text>
//       <FlatList
//         data={exercises}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.gifUrl }} style={styles.image} />
//             <Text style={styles.exerciseName}>{item.name}</Text>
//             <Text style={styles.bodyPart}>Target: {item.target}</Text>
//             <Text style={styles.equipment}>Equipment: {item.equipment}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
//   card: { padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8, marginBottom: 10 },
//   image: { width: "100%", height: 150, resizeMode: "contain" },
//   exerciseName: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
//   bodyPart: { fontSize: 14, color: "gray" },
//   equipment: { fontSize: 14, fontStyle: "italic", color: "gray" },
// });

// export default FitnessGuides;
