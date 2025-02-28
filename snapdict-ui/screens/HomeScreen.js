// HomeScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Image, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Card, Surface, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();

  useEffect(() => {
    // Request camera permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Access Needed',
          'We need permission to use your camera to take pictures of words.'
        );
      }

      // Request media library permissions
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert(
          'Photos Access Needed',
          'We need permission to access your photos to find pictures with words.'
        );
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      let photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!photo.canceled && photo.assets && photo.assets.length > 0) {
        const imageUri = photo.assets[0].uri;
        // Navigate to UploadScreen with the captured image URI
        navigation.navigate('Upload', { imageUri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Oops!', 'We couldn\'t open the camera. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        navigation.navigate('Upload', { imageUri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Oops!', 'We couldn\'t open your pictures. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.primary }]}>SnapDict</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Take a picture of words to learn what they mean
          </Text>
        </View>
        
        <Surface style={[styles.featuresCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.featuresTitle, { color: theme.colors.primary }]}>What You Can Do</Text>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="camera-outline" size={36} color={theme.colors.primary} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.colors.primary }]}>Take a Picture</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                Take a picture of words you don't know
              </Text>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <MaterialCommunityIcons name="book-open-variant" size={36} color={theme.colors.primary} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.colors.primary }]}>Learn New Words</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                Find out what words mean with simple explanations
              </Text>
            </View>
          </View>
        </Surface>
        
        <Text style={[styles.getStartedText, { color: theme.colors.primary }]}>Let's Start!</Text>
        
        <Button
          mode="contained"
          icon="camera"
          onPress={takePhoto}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={{ color: 'white' }}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Take a Picture</Text>
        </Button>
        
        <Button
          mode="contained"
          icon="image"
          onPress={pickImage}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={{ color: 'white' }}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Choose a Picture</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
  },
  heroContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  featuresCard: {
    padding: 24,
    borderRadius: 24,
    marginVertical: 24,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  featureTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  getStartedText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
  },
  buttonContent: {
    height: 70,
  },
  buttonText: {
    fontSize: 20, 
    fontWeight: 'bold',
  },
});
