import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const WordScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [words, setWords] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!camera) return;
    
    try {
      setIsProcessing(true);
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });

      // Create form data for image upload
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // Send to backend
      const response = await fetch('YOUR_BACKEND_URL/process-image/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      setWords(result.complex_words);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        type={Camera.Constants.Type.back}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Text style={styles.text}>
              {isProcessing ? 'Processing...' : 'Take Picture'}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <ScrollView style={styles.resultContainer}>
        {Object.entries(words).map(([word, definition]) => (
          <View key={word} style={styles.wordContainer}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.definition}>{definition}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: '50%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  wordContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  definition: {
    fontSize: 16,
    color: '#333',
  },
});

export default WordScanner;