import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { Text, Button, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function WordDetailScreen({ route }) {
  const { word, info } = route.params || {};
  const navigation = useNavigation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  if (!word || !info) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <View style={styles.container}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            No word details found.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
            labelStyle={{ color: 'white' }}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Go Back</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={[styles.wordTitle, { color: theme.colors.primary }]}>{word}</Text>
          {info.pos && (
            <Text style={[styles.partOfSpeech, { color: theme.colors.text }]}>
              {info.pos === 'n' ? 'noun' : 
               info.pos === 'v' ? 'verb' : 
               info.pos === 'a' ? 'adjective' : 
               info.pos === 'r' ? 'adverb' : info.pos}
            </Text>
          )}
        </View>
        
        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Meaning</Text>
          <Text style={[styles.definition, { color: theme.colors.text }]}>{info.definition}</Text>
        </View>
        
        {info.example && (
          <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Example</Text>
            <View style={styles.exampleContainer}>
              <Text style={[styles.exampleText, { color: theme.colors.text }]}>"{info.example}"</Text>
            </View>
          </View>
        )}
        
        {info.synonyms && info.synonyms.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Similar Words</Text>
            <View style={styles.chipsContainer}>
              {info.synonyms.map(synonym => (
                <Chip 
                  key={synonym} 
                  style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
                >
                  <Text style={{ color: theme.colors.onPrimaryContainer, fontSize: 16 }}>{synonym}</Text>
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        {info.antonyms && info.antonyms.length > 0 && (
          <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Opposite Words</Text>
            <View style={styles.chipsContainer}>
              {info.antonyms.map(antonym => (
                <Chip 
                  key={antonym} 
                  style={[styles.chip, { backgroundColor: theme.colors.secondaryContainer }]}
                >
                  <Text style={{ color: theme.colors.onSecondaryContainer, fontSize: 16 }}>{antonym}</Text>
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          contentStyle={styles.backButtonContent}
          labelStyle={{ color: 'white' }}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Go Back</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  wordTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  partOfSpeech: {
    fontSize: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  definition: {
    fontSize: 22,
    lineHeight: 32,
  },
  exampleContainer: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  exampleText: {
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButton: {
    marginTop: 24,
    borderRadius: 30,
  },
  backButtonContent: {
    height: 56,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
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