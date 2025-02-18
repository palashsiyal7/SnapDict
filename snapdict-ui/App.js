// App.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request camera permissions on mount
  useEffect(() => {
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

  // Launch the camera to take a photo
  const takePhoto = async () => {
    try {
      let photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log('Photo result:', photo);

      // Use the URI from the first asset (Expo now returns an assets array)
      if (!photo.canceled && photo.assets && photo.assets.length > 0) {
        setImageUri(photo.assets[0].uri);
        setResult(null); // Reset previous result if any
      } else {
        console.log('Photo capture was cancelled or no assets returned');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Camera Error', 'There was an error accessing the camera.');
    }
  };

  // Upload the captured image to the FastAPI backend
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please take a photo first.');
      return;
    }
    setLoading(true);

    let formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'your actual server url',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Could not process the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Upload Image" onPress={uploadImage} disabled={!imageUri || loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />}

      {result && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.header}>Extracted Text:</Text>
          <Text style={styles.text}>{result.original_text}</Text>
          <Text style={styles.header}>Complex Words & Definitions:</Text>
          {Object.entries(result.complex_words).map(([word, definition]) => (
            <Text key={word} style={styles.text}>
              {word}: {definition}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
    maxHeight: 300,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
});
