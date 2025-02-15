import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';


const FeaturedGuides = () => {

  return (
    <View style={{ flex: 1, backgroundColor: '#1a202c', paddingBottom: 20 }}>
      {/* Hero Section */}
      <View style={{ width: '100%', height: 200, position: 'relative' }}>
        <Image
          source={require('@/assets/images/wheelfit_background.png')} // Ensure this image exists in your assets folder
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Adaptive Strength Workout</Text>
          <Text style={{ color: '#d1d5db', textAlign: 'center', marginTop: 8, paddingHorizontal: 16 }}>
            Build core strength, improve mobility, and stay active with this wheelchair-friendly workout.
          </Text>
        </View>
      </View>

      {/* Workout Description */}
      <View style={{ padding: 16, backgroundColor: '#2d3748', margin: 16, borderRadius: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>About This Workout</Text>
        <Text style={{ color: '#a0aec0' }}>
          A 4-week fitness plan designed for wheelchair users, focusing on upper body strength, endurance, and core stability. No gym required!
        </Text>
      </View>

      {/* Program Details */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Program Details</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#4299e1', borderRadius: 10, marginRight: 8 }} />
          <Text style={{ color: 'white' }}>At home / outdoors</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#4299e1', borderRadius: 10, marginRight: 8 }} />
          <Text style={{ color: 'white' }}>Equipment optional (Resistance bands, weights)</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#4299e1', borderRadius: 10, marginRight: 8 }} />
          <Text style={{ color: 'white' }}>8-27 mins / day</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#4299e1', borderRadius: 10, marginRight: 8 }} />
          <Text style={{ color: 'white' }}>Wheelchair-accessible workouts</Text>
        </View>
      </View>

      {/* Start Workout Button */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, alignItems: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#4299e1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeaturedGuides;
