import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './AppNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const SplashScreenTwo = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <ImageBackground 
      source={require('@/assets/images/wheelfit_background.png')} // Replace with your actual image
      style={{ flex: 1, justifyContent: 'flex-end' }}
      resizeMode="cover"
    >
      {/* Overlay for better text visibility */}
      <LinearGradient 
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']} 
        style={{ position: 'absolute', width: '100%' , height: '100%' }}
      />

      <View style={{ paddingHorizontal: 20, paddingBottom: 50 }}>
        {/* Logo
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>🏋️</Text>
        </View> */}

        {/* Title */}
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          Welcome To {'\n'} WheelFit
        </Text>

        {/* Subtitle */}
        <Text style={{ fontSize: 16, color: '#cccccc', textAlign: 'center', marginVertical: 10 }}>
          Your personal adaptive fitness assistant
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('GuideScreen')}
          style={{
            backgroundColor: '#4C82EF',
            paddingVertical: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Get Started</Text>
          <ArrowRight color="white" size={20} style={{ marginLeft: 10 }} />
        </TouchableOpacity>

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

export default SplashScreenTwo;
