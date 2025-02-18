// HomeScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  useEffect(() => {
    // Request camera permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera permissions are required to use this app.'
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
      Alert.alert('Camera Error', 'There was an error accessing the camera.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Replace this placeholder with your actual logo or hero graphic */}
      <Image
        source={{ uri: 'https://via.placeholder.com/300x100?text=SnapDict+Logo' }}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to SnapDict</Text>
      <Text style={styles.subtitle}>
        A modern, AI-powered dictionary that simplifies complex words instantly.
      </Text>

      <Button
        mode="contained"
        onPress={takePhoto}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Take Photo
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    // Center all content both horizontally and vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: -90,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    paddingHorizontal: 10, // helps on very narrow screens
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
