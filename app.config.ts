import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WheelFit',
  slug: 'wheelfit',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/wheelfit_logo.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/favicon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    }
  }
});