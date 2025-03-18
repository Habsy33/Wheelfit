import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Header } from '@/components/Header';
import { getPreferences, updatePreferences } from '@/utils/preferences'; // Import updatePreferences
import { auth } from '@/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PreferenceKey = 'goal' | 'gender' | 'limitation' | 'age' | 'weight' | 'height' | 'preference';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const YourPreferences = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<{
    goal: string | null;
    gender: string | null;
    limitation: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    preference: string | null;
  } | null>(null);

  const [editedPreferences, setEditedPreferences] = useState<{
    goal: string | null;
    gender: string | null;
    limitation: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    preference: string | null;
  } | null>(null);

  // Fetch the user's preferences from Firebase
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('No authenticated user found');
          return;
        }

        const userPreferences = await getPreferences();
        setPreferences(userPreferences);
        setEditedPreferences(userPreferences); // Initialize editedPreferences
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Handle saving changes
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !editedPreferences) {
        console.warn('No authenticated user or preferences found');
        return;
      }

      // Update each field in Firebase
      for (const [field, value] of Object.entries(editedPreferences)) {
        await updatePreferences(field, value);
      }

      // Update local state
      setPreferences(editedPreferences);
      setIsEditing(false);
      console.log('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Handle canceling edits
  const handleCancel = () => {
    setEditedPreferences(preferences); // Reset to original preferences
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number | null) => {
    setEditedPreferences((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const renderPreferenceItem = (
    icon: IconName,
    title: string,
    field: PreferenceKey,
    value: string | number | null,
    unit?: string
  ) => {
    const displayValue = value ? (unit ? `${value} ${unit}` : value) : 'Not set';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={icon} size={24} color="#007BFF" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={editedPreferences?.[field]?.toString() || ''}
            onChangeText={(text) => {
              if (['age', 'weight', 'height'].includes(field)) {
                handleInputChange(field, parseFloat(text) || null);
              } else {
                handleInputChange(field, text);
              }
            }}
            keyboardType={['age', 'weight', 'height'].includes(field) ? 'numeric' : 'default'}
            placeholder={`Enter your ${title.toLowerCase()}`}
          />
        ) : (
          <Text style={styles.preferenceText}>{displayValue}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="WheelFit" subtitle="Adaptive Home Workouts" />

      <View style={styles.headerContainer}>
        <Text style={[styles.title, isEditing && styles.titleEditing]}>Your Preferences</Text>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <MaterialCommunityIcons name="close" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.preferencesContainer}>
        {renderPreferenceItem('target', 'Fitness Goal', 'goal', preferences?.goal ?? null)}
        {renderPreferenceItem('gender-male-female', 'Gender', 'gender', preferences?.gender ?? null)}
        {renderPreferenceItem('alert-circle', 'Limitation', 'limitation', preferences?.limitation ?? null)}
        {renderPreferenceItem('calendar', 'Age', 'age', preferences?.age ?? null, 'years')}
        {renderPreferenceItem('weight', 'Weight', 'weight', preferences?.weight ?? null, 'kg')}
        {renderPreferenceItem('human-male-height', 'Height', 'height', preferences?.height ?? null, 'cm')}
        {renderPreferenceItem('star', 'Preference', 'preference', preferences?.preference ?? null)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: -50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  titleEditing: {
    fontSize: 22,
  },
  preferencesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  preferenceText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    backgroundColor: '#f9f9f9',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default YourPreferences;