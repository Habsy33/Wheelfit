import React, { useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './AppNavigation';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const SplashScreenTwo = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const scale = new Animated.Value(1);

  useEffect(() => {
    const createAnimation = () => {
      return Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        })
      ]);
    };

    Animated.loop(createAnimation()).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: [{ scale }]
      }}>
        <ImageBackground 
          source={require('@/assets/images/wheelfit_background.png')}
          style={{ flex: 1 }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Overlay for better text visibility */}
      <LinearGradient 
        colors={['transparent', 'rgba(0, 0, 0, 0.8)']} 
        style={{ position: 'absolute', width: '100%' , height: '100%' }}
      />

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 50 }}>
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
    </View>
  );
};

export default SplashScreenTwo;
