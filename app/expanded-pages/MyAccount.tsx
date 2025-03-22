import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { auth, db, ref, get } from '@/firebaseConfig';
import { getPreferences } from '@/utils/preferences';

const MyAccount: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    gender: string;
    age: string | null;
  }>({
    fullName: '',
    email: '',
    gender: 'Male',
    age: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("No authenticated user found");
          return;
        }

        // Fetch user data
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);

        // Fetch preferences
        const preferences = await getPreferences();

        if (userSnapshot.exists()) {
          const data = userSnapshot.val();
          setUserData({
            fullName: data.fullName || "User",
            email: user.email || "",
            gender: data.gender || "Male",
            age: preferences?.age || null,
          });
        } else {
          console.warn("No user data found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Header title="My Account" subtitle="Manage Your Profile & Goals" />
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={24} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>Full Name:</Text>
              <Text style={styles.infoValue}>{userData.fullName}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={24} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>Email:</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="people" size={24} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>Gender:</Text>
              <View style={styles.genderDisplay}>
                <FontAwesome5 
                  name={userData.gender === 'Male' ? 'male' : 'female'} 
                  size={24} 
                  color="#007BFF" 
                />
                <Text style={styles.infoValue}>{userData.gender}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="cake" size={24} color="#666" style={styles.icon} />
              <Text style={styles.infoText}>Age Range:</Text>
              <Text style={styles.infoValue}>{userData.age || 'Not specified'}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#F4F6F8', marginTop: -50 },
  container: { flex: 1, padding: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 5,
  },
  section: { 
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoContainer: { paddingVertical: 10 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: { fontSize: 16, color: '#555', marginRight: 10 },
  infoValue: { fontWeight: 'bold', color: '#222' },
  genderDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default MyAccount;
