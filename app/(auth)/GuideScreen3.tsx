import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './AppNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';


const GuideScreen3 = () => {

  const router = useRouter();
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <ImageBackground 
      source={require('@/assets/images/wheelfit_background4.png')}
      style={{ flex: 1, justifyContent: 'flex-end' }}
      resizeMode="cover"
    >
      {/* Overlay for better text visibility */}
      <LinearGradient 
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']} 
        style={{ position: 'absolute', width: '100%' , height: '100%' }}
      />

            {/* Progress Bar */}
            <View style={{ position: 'absolute', top: 70, left: 0, right: 0, paddingHorizontal: 20 }}>
        <View style={{ height: 5, backgroundColor: '#555', borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ width: '98%', height: '100%', backgroundColor: '#FFF' }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 50 }}>
        {/* Title */}
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          Health Metrics &{'\n'} Fitness Analytics
        </Text>

        {/* Subtitle */}
        <Text style={{ fontSize: 16, color: '#cccccc', textAlign: 'center', marginVertical: 10 }}>
        Monitor your health profile with ease. 📈
        </Text>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.replace('GuideScreen2')} 
            style={{
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginHorizontal: 15,
            }}
          >
            <ArrowLeft color="white" size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('../SignIn')}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 10,
              backgroundColor: '#4C82EF',
              marginHorizontal: 15,
            }}
          >
            <ArrowRight color="white" size={30} />
          </TouchableOpacity>
        </View>

        {/* Sign In Option */}
        <Text 
          onPress={() => navigation.navigate('SignIn')}
          style={{ textAlign: 'center', color: 'white', marginTop: 15 }}
        >
          Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default GuideScreen3;
