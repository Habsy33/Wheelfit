import { Cloudinary } from '@cloudinary/url-gen';
import Constants from 'expo-constants';

// Add type for React Native FormData file
type FormDataFile = {
  uri: string;
  type: string;
  name: string;
} & Blob;

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: Constants.expoConfig?.extra?.cloudinaryCloudName
  },
  url: {
    secure: true
  }
});

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as FormDataFile);
    formData.append('upload_preset', Constants.expoConfig?.extra?.cloudinaryUploadPreset || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${Constants.expoConfig?.extra?.cloudinaryCloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export { cloudinary };