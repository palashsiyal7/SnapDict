import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

export default function ResultScreen({ route }) {
  const { data } = route.params || {};
  // data should be something like: { complex_words: { word1: 'def1', word2: 'def2' } }

  if (!data || !data.complex_words) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No results found. Please upload an image first.
        </Text>
      </View>
    );
  }

  const { complex_words } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Complex Words &amp; Definitions</Text>
      {Object.entries(complex_words).map(([word, definition]) => (
        <Text style={styles.wordItem} key={word}>
          <Text style={{ fontWeight: 'bold' }}>{word}:</Text> {definition}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'center',
  },
  wordItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
    marginTop: 50,
  },
});
