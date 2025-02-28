import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Button, ActivityIndicator, Text, IconButton, Surface, Portal, Modal, Card, ProgressBar, useTheme } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UploadScreen({ route, navigation }) {
  const { imageUri } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [localImageUri, setLocalImageUri] = useState(imageUri);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  const uploadImage = async () => {
    if (!localImageUri) {
      Alert.alert('No Picture', 'Please take a picture first.');
      return;
    }
    setLoading(true);
    setProcessingStep('Looking at your picture...');
    setLoadingProgress(10);
    
    // Simulate steps for better UX
    setTimeout(() => {
      setProcessingStep('Finding the words...');
      setLoadingProgress(30);
    }, 1000);

    let formData = new FormData();
    formData.append('image', {
      uri: localImageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      setTimeout(() => {
        setProcessingStep('Reading the words...');
        setLoadingProgress(50);
      }, 2000);
      
      setTimeout(() => {
        setProcessingStep('Finding tricky words...');
        setLoadingProgress(70);
      }, 3000);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/process-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (percentCompleted > 30 && percentCompleted <= 70) {
              setLoadingProgress(percentCompleted);
            }
          }
        }
      );

      setProcessingStep('Almost done...');
      setLoadingProgress(90);

      // Check if response data is empty or has no text content
      if (!response.data || 
          (Object.keys(response.data.complex_words || {}).length === 0 && 
           Object.keys(response.data.definitions || {}).length === 0)) {
        throw new Error('NO_TEXT_FOUND');
      }

      setTimeout(() => {
        setLoadingProgress(100);
        console.log('Upload response:', response.data);
        navigation.navigate('Result', { data: response.data });
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle specific error cases
      if (error.message === 'NO_TEXT_FOUND') {
        Alert.alert(
          'No Words Found',
          'We couldn\'t find any words in your picture. Please try again with a picture that has some words.'
        );
      } else if (error.response?.status === 413) {
        Alert.alert(
          'Picture Too Big',
          'The picture is too big. Please try a smaller picture.'
        );
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert(
          'Taking Too Long',
          'It\'s taking too long to read your picture. Please try again with a clearer picture.'
        );
      } else if (!error.response) {
        Alert.alert(
          'No Internet',
          'Please check your internet connection and try again.'
        );
      } else {
        Alert.alert(
          'Something Went Wrong',
          'We couldn\'t read your picture. Please try again.'
        );
      }
    } finally {
      setLoading(false);
      setProcessingStep('');
      setLoadingProgress(0);
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
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Oops!', 'We couldn\'t open your pictures. Please try again.');
    }
  };

  const takePicture = async () => {
    try {
      let photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!photo.canceled && photo.assets && photo.assets.length > 0) {
        setLocalImageUri(photo.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Oops!', 'We couldn\'t open the camera. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.primary }]}>Take a Picture</Text>
        <Text style={[styles.subheader, { color: theme.colors.text }]}>
          Take a picture of words you want to learn
        </Text>
        
        <Card style={[styles.imageCard, { backgroundColor: theme.colors.surface }]}>
          {localImageUri ? (
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: localImageUri }}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={[styles.imageBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.imageBadgeText, { color: theme.colors.surface }]}>Your Picture</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialCommunityIcons name="camera-plus" size={100} color={theme.colors.primary} />
              <Text style={[styles.placeholderText, { color: theme.colors.primary }]}>No picture yet</Text>
              <Text style={[styles.placeholderSubtext, { color: theme.colors.text }]}>
                Press one of the big buttons below
              </Text>
            </View>
          )}
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="camera"
            onPress={takePicture}
            style={[styles.button, styles.cameraButton]}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: 'white' }}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Take Picture</Text>
          </Button>
          
          <Button
            mode="contained"
            icon="image"
            onPress={pickImage}
            style={[styles.button, styles.galleryButton]}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: 'white' }}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Choose Picture</Text>
          </Button>
        </View>
        
        {localImageUri && (
          <View style={styles.processButtonContainer}>
            <Button 
              mode="contained" 
              onPress={uploadImage}
              style={styles.processButton}
              contentStyle={styles.processButtonContent}
              icon="book-open-variant"
              disabled={loading}
              labelStyle={{ color: 'white' }}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>Find Words</Text>
            </Button>
          </View>
        )}
        
        <Portal>
          <Modal 
            visible={modalVisible} 
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Surface style={[styles.modalSurface, { backgroundColor: theme.colors.surface }]}>
              <IconButton
                icon="close"
                size={30}
                style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
                iconColor={theme.colors.surface}
                onPress={() => setModalVisible(false)}
              />
              
              <Image
                source={{ uri: localImageUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </Surface>
          </Modal>
          
          <Modal 
            visible={loading} 
            dismissable={false}
            contentContainerStyle={styles.loadingModalContainer}
          >
            <Surface style={[styles.loadingModalSurface, { backgroundColor: theme.colors.surface }]}>
              <ActivityIndicator 
                animating={true} 
                color={theme.colors.primary} 
                size={50}
                style={styles.loader}
              />
              <Text style={[styles.processingText, { color: theme.colors.primary }]}>{processingStep}</Text>
              <ProgressBar 
                progress={loadingProgress / 100} 
                color={theme.colors.primary} 
                style={styles.progressBar}
              />
              <Text style={[styles.progressText, { color: theme.colors.text }]}>{loadingProgress}%</Text>
            </Surface>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  imageCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  button: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },
  buttonContent: {
    height: 70,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 20, 
    fontWeight: 'bold',
  },
  cameraButton: {
    marginBottom: 16,
  },
  galleryButton: {
  },
  processButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
    zIndex: 1,
  },
  processButton: {
    borderRadius: 16,
    elevation: 4,
  },
  processButtonContent: {
    height: 70,
    paddingVertical: 8,
  },
  modalContainer: {
    padding: 20,
  },
  modalSurface: {
    padding: 8,
    borderRadius: 24,
    elevation: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: 500,
    borderRadius: 16,
  },
  loadingModalContainer: {
    padding: 20,
  },
  loadingModalSurface: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  loader: {
    marginBottom: 16,
  },
  processingText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
  },
});
