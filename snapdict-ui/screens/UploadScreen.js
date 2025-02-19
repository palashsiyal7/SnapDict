import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from '@env';

export default function UploadScreen({ route, navigation }) {
  const { imageUri } = route.params || {};
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please go back and take a photo first.');
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
        `${API_BASE_URL}/api/v1/process-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 130000,
        }
      );

      // Check if response data is empty or has no text content
      if (!response.data || 
          (Object.keys(response.data.complex_words || {}).length === 0 && 
           Object.keys(response.data.definitions || {}).length === 0)) {
        throw new Error('NO_TEXT_FOUND');
      }

      console.log('Upload response:', response.data);
      navigation.navigate('Result', { data: response.data });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle specific error cases
      if (error.message === 'NO_TEXT_FOUND') {
        Alert.alert(
          'No Text Detected',
          'We couldn\'t find any text in your image. Please make sure the image contains clear, readable text and try again.'
        );
      } else if (error.response?.status === 413) {
        Alert.alert(
          'Image Too Large',
          'The image file is too large. Please try with a smaller image.'
        );
      } else if (!error.response) {
        Alert.alert(
          'Connection Error',
          'Please check your internet connection and try again.'
        );
      } else {
        Alert.alert(
          'Upload Failed',
          'Could not process the image. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No image found. Please go back and take a photo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Preview Your Photo</Text>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ margin: 20 }} />
      ) : (
        <Button
          mode="contained"
          onPress={uploadImage}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Upload Image
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E91E63',
    alignSelf: 'center',
    width: '60%',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
