import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { signOut } from "firebase/auth";
import { auth, db, ref, get } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { set} from "firebase/database";
import { deleteUser } from "firebase/auth";
import { remove } from "firebase/database";
import { Alert } from "react-native"; 


const Profile = () => {
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
  const navigation = useNavigation();
  const router = useRouter();


  const toggleFaceId = () => setFaceIdEnabled((prev) => !prev);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("No authenticated user found");
          return;
        }

        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setFullName(data.fullName || "User");
          setUsername(data.username || "@unknown");
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

  const handleEditPress = () => {
    setIsEditing(true);
    setEditedFullName(fullName || '');
    setEditedUsername(username || '');
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      console.warn("No authenticated user found");
      return;
    }
  
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
  
    try {
      await set(userRef, {
        fullName: editedFullName,
        username: editedUsername,
      });
  
      setFullName(editedFullName);
      setUsername(editedUsername);
      setIsEditing(false);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      console.warn("No authenticated user found.");
      return;
    }
  
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Delete user data from Firebase Realtime Database
              const userRef = ref(db, `users/${user.uid}`);
              await remove(userRef);
              console.log("User data deleted from database");
  
              // Delete user from Firebase Authentication
              await deleteUser(user);
              console.log("User account deleted from Firebase Auth");
  
              // Redirect to sign-in page
              router.replace("/");
            } catch (error: any) {
              console.error("Error deleting account:", error.message);
              Alert.alert("Error", "Failed to delete account. Try again later.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="WheelFit" subtitle="Adaptive Home Workouts" streak="28/30" />

      <View style={styles.meSection}>
        <Text style={styles.meText}>Welcome to WheelFit!</Text>
      </View>

      <View style={styles.header}>
        <Image
          source={require('@/assets/images/profile_pic.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedFullName}
                onChangeText={setEditedFullName}
              />
              <TextInput
                style={styles.input}
                value={editedUsername}
                onChangeText={setEditedUsername}
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.username}>{username}</Text>
            </>
          )}
        </View>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleSave}>
              <MaterialIcons name="check" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel}>
              <MaterialIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Account Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => router.push('../expanded-pages/MyAccount')}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="account-circle" size={24} color="#666" />
            <Text style={styles.optionText}>My Account</Text>
          </View>
          <MaterialIcons name="warning" size={20} color="red" />
        </TouchableOpacity>


        <TouchableOpacity style={styles.option} onPress={() => router.push('../expanded-pages/SettingsPage')}>
          <View style={styles.optionLeft}>
            <FontAwesome name="heart" size={24} color="#666" />
            <Text style={[styles.optionText]}>Settings</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => router.push('../expanded-pages/YourPreferences')}>
          <View style={styles.optionLeft}>
            <FontAwesome name="sliders" size={24} color="#666" />
            <Text style={styles.optionText}>Your Preferences</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="logout" size={24} color="#666" />
            <Text style={styles.optionText}>Log out</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleDeleteAccount}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="delete" size={24} color="#FF0000" />
            <Text style={styles.optionDeleteText}>Delete Your Account</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#FF0000" />
        </TouchableOpacity>

      </View>

      
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: -60,
  },
  header: {
    marginTop: 10,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005CEE',
    padding: 15,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    borderRadius: 50,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: '#ddd',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 16,
  },
  optionsContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  optionDeleteText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FF0000',
  },
  helpContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  meSection: {
    padding: 16,
  },
  meText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',

  },

  editActions: {
    flexDirection: 'row',
    gap: 10,  // Adjust spacing as needed
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 10,
  },
});

export default Profile;
