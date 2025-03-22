import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TourGuideProps {
  visible: boolean;
  onClose: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to WheelFit!',
      description: 'Let\'s take a quick tour to help you get started with your fitness journey.',
      icon: '🏋️‍♂️',
    },
    {
      title: 'Featured Workouts',
      description: 'Swipe through our featured workouts at the top. Each one is specially designed for wheelchair users.',
      icon: '🎯',
    },
    {
      title: 'Quick Start Section',
      description: 'Filter workouts by difficulty level: Beginner, Intermediate, or Advanced.',
      icon: '⚡',
    },
    {
      title: 'Classic Workouts',
      description: 'Browse our collection of classic workouts, each with detailed instructions and modifications.',
      icon: '💪',
    },
    {
      title: 'Ready to Start!',
      description: 'You\'re all set to begin your fitness journey with WheelFit!',
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip Tour</Text>
          </TouchableOpacity>
          
          <View style={styles.stepContainer}>
            <Text style={styles.stepIcon}>{steps[currentStep].icon}</Text>
            <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
            <Text style={styles.stepDescription}>{steps[currentStep].description}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.dotsContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentStep && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default TourGuide; 