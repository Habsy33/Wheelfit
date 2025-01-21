import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Profile = () => {
  const [faceIdEnabled, setFaceIdEnabled] = React.useState(false);

  const toggleFaceId = () => setFaceIdEnabled((previousState) => !previousState);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your profile image source
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Habeeb Oluyemo</Text>
          <Text style={styles.username}>@Habeeb</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Account Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="account-circle" size={24} color="#666" />
            <Text style={styles.optionText}>My Account</Text>
          </View>
          <MaterialIcons name="warning" size={20} color="red" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <FontAwesome name="sliders" size={24} color="#666" />
            <Text style={styles.optionText}>Your Preferences</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <FontAwesome name="heart" size={24} color="#666" />
            <Text style={[styles.optionText, { color: 'red' }]}>
              Saved Beneficiary
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="fingerprint" size={24} color="#666" />
            <Text style={styles.optionText}>Face ID / Touch ID</Text>
          </View>
          <Switch
            value={faceIdEnabled}
            onValueChange={toggleFaceId}
            thumbColor={faceIdEnabled ? '#1E90FF' : '#ddd'}
          />
        </View>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="security" size={24} color="#666" />
            <Text style={styles.optionText}>Two-Factor Authentication</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="logout" size={24} color="#666" />
            <Text style={styles.optionText}>Log out</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Help & Support */}
      <View style={styles.helpContainer}>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="help-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Help & Support</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005CEE',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
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
    borderRadius: 8,
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
  helpContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
});

export default Profile;
