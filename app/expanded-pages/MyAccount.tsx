import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';

const MyAccount: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<{ gender: string; dob: string }>({
    gender: 'Male',
    dob: '1998-05-14',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(user.dob));

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setUser({ ...user, dob: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleGenderChange = (gender: string) => {
    setUser({ ...user, gender });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Header title="My Account" streak="28/30" subtitle="Manage Your Profile & Goals" />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Gender:</Text>
            <View style={styles.genderSelection}>
              <TouchableOpacity onPress={() => handleGenderChange('Male')} style={[styles.genderButton, user.gender === 'Male' && styles.selectedGender]}>
                <FontAwesome5 name="male" size={24} color={user.gender === 'Male' ? '#007BFF' : '#777'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleGenderChange('Female')} style={[styles.genderButton, user.gender === 'Female' && styles.selectedGender]}>
                <FontAwesome5 name="female" size={24} color={user.gender === 'Female' ? '#007BFF' : '#777'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>Date of Birth:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.infoValue}>{user.dob}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker 
                value={date} 
                mode="date" 
                display="spinner" 
                onChange={handleDateChange} 
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#F4F6F8', marginTop: -50 },
  container: { flex: 1, padding: 1 },
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
  infoText: { fontSize: 16, color: '#555', marginBottom: 5 },
  infoValue: { fontWeight: 'bold', color: '#222' },
  genderSelection: { flexDirection: 'row', gap: 20, marginVertical: 10 },
  genderButton: { padding: 10, borderRadius: 50, backgroundColor: '#E8F0FE' },
  selectedGender: { backgroundColor: '#D0E3FF' },
  datePickerButton: {
    backgroundColor: '#E8F0FE',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
  },
});

export default MyAccount;
