import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Animated, SafeAreaView, StatusBar } from 'react-native';
import { Text, Card, Chip, Button, Surface, useTheme } from 'react-native-paper';

export default function ResultScreen({ route, navigation }) {
  const { data } = route.params || {};
  const [selectedWord, setSelectedWord] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef(null);
  const theme = useTheme();

  if (!data || !data.complex_words) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <View style={styles.container}>
          <Surface style={[styles.errorCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>
              No results found. Please take a photo first.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Home')}
              style={styles.actionButton}
              labelStyle={{ color: 'white' }}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>Go Home</Text>
            </Button>
          </Surface>
        </View>
      </SafeAreaView>
    );
  }

  const { complex_words, original_text, processing_time } = data;
  const wordEntries = Object.entries(complex_words);

  const handleWordPress = (word) => {
    setSelectedWord(selectedWord === word ? null : word);
    
    // Animate when a word is selected
    Animated.spring(animation, {
      toValue: selectedWord === word ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const navigateToWordDetail = (word, wordInfo) => {
    const info = formatWordInfo(wordInfo);
    navigation.navigate('WordDetail', { word, info });
  };

  const formatWordInfo = (wordInfo) => {
    if (typeof wordInfo === 'string') {
      // Handle old format where definition was just a string
      return { definition: wordInfo };
    }
    // Handle new format where definition is an object
    return wordInfo;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.outerScrollContent}>
        <View style={styles.container}>
          <Text style={[styles.header, { color: theme.colors.primary }]}>Words Found</Text>
          
          {processing_time && (
            <Text style={[styles.processingTime, { color: theme.colors.text }]}>
              Processed in {processing_time} seconds
            </Text>
          )}
          
          {original_text && (
            <Card style={[styles.textCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Original Text</Text>
                <Text style={[styles.originalText, { color: theme.colors.text }]}>{original_text}</Text>
              </Card.Content>
            </Card>
          )}

          <Text style={[styles.sectionTitle, { color: theme.colors.primary, marginTop: 20 }]}>Tap a Word to See Meaning</Text>
          
          <View style={styles.wordsContainer}>
            {wordEntries.map(([word, wordInfo], index) => {
              const info = formatWordInfo(wordInfo);
              return (
                <Pressable
                  key={word}
                  onPress={() => navigateToWordDetail(word, wordInfo)}
                  style={({ pressed }) => [
                    styles.wordButton,
                    { 
                      backgroundColor: pressed ? theme.colors.primaryContainer : theme.colors.surface,
                      borderColor: theme.colors.primary
                    }
                  ]}
                >
                  <Text style={[styles.wordButtonText, { color: theme.colors.primary }]}>{word}</Text>
                  <Text 
                    style={[styles.wordPreview, { color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {info.definition}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Upload')}
            style={styles.newPhotoButton}
            contentStyle={styles.newPhotoButtonContent}
            labelStyle={{ color: 'white' }}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Take Another Photo</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  outerScrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 0,
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  processingTime: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  textCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  originalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  wordsContainer: {
    marginVertical: 12,
  },
  wordButton: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
  },
  wordButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wordPreview: {
    fontSize: 16,
    opacity: 0.8,
  },
  newPhotoButton: {
    marginVertical: 16,
    borderRadius: 30,
  },
  newPhotoButtonContent: {
    height: 52,
  },
  buttonText: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  errorCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 30,
    paddingVertical: 8,
  },
});
