import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword';
import Index from '../(tabs)/index';
import SplashScreen from './SplashScreen';
import SplashScreenTwo from './SplashScreenTwo';
import GuideScreen from './GuideScreen';
import GuideScreen2 from './GuideScreen2';
import GuideScreen3 from './GuideScreen3';
import FeaturedGuides from '../expanded-pages/FeaturedGuides';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreenTwo" component={SplashScreenTwo} options={{ headerShown: false }} />
      <Stack.Screen name="GuideScreen" component={GuideScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GuideScreen2" component={GuideScreen2} options={{ headerShown: false }} />
      <Stack.Screen name="GuideScreen3" component={GuideScreen3} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
      <Stack.Screen name="FeaturedGuides" component={FeaturedGuides} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export type RootStackParamList = {
  SplashScreen: undefined;
  SplashScreenTwo: undefined;
  GuideScreen: undefined;
  GuideScreen2: undefined;
  GuideScreen3: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Index: undefined;
  FeaturedGuides: undefined;
};

// Define a type for navigation prop
export type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default AppNavigator;
