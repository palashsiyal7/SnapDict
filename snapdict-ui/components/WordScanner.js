import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const API_URL = 'http://localhost:8000/api/v1/process-image'; // Update with your server URL

const WordScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [cameraType, setCameraType] = useState(null);
  const [words, setWords] = useState({});
  const [originalText, setOriginalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      // Set camera type after initialization
      if (Camera.Constants?.Type) {
        setCameraType(Camera.Constants.Type.back);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (!camera) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }
    
    try {
      setIsProcessing(true);
      setWords({});
      setOriginalText('');

      // Take picture
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // Send to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.complex_words && result.original_text) {
        setWords(result.complex_words);
        setOriginalText(result.original_text);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'Error',
        'Failed to process image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render camera until we have the type
  if (!cameraType) {
    return <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>;
  }

  if (hasPermission === null) {
    return <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>;
  }

  if (hasPermission === false) {
    return <View style={styles.center}>
      <Text>No access to camera</Text>
      <TouchableOpacity 
        style={styles.permissionButton}
        onPress={() => Camera.requestCameraPermissionsAsync()}
      >
        <Text>Request Permission</Text>
      </TouchableOpacity>
    </View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        type={cameraType}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isProcessing && styles.buttonDisabled]}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.text}>Take Picture</Text>
            )}
          </TouchableOpacity>
        </View>
      </Camera>

      <ScrollView style={styles.resultContainer}>
        {originalText ? (
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Detected Text:</Text>
            <Text style={styles.originalText}>{originalText}</Text>
          </View>
        ) : null}

        {Object.keys(words).length > 0 ? (
          <View style={styles.wordsContainer}>
            <Text style={styles.sectionTitle}>Complex Words:</Text>
            {Object.entries(words).map(([word, definition]) => (
              <View key={word} style={styles.wordContainer}>
                <Text style={styles.word}>{word}</Text>
                <Text style={styles.definition}>{definition}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  wordsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  wordContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  definition: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  originalText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default WordScanner;