// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, Text, IconButton } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import ResultScreen from './screens/ResultScreen';
import WordDetailScreen from './screens/WordDetailScreen';

const Stack = createStackNavigator();

// Adapt navigation themes
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Define text variant overrides
const textVariantsOverride = {
  regular: { fontWeight: 'normal' },
  medium: { fontWeight: '500' },
  bold: { fontWeight: 'bold' },
  heavy: { fontWeight: '900' }
};

// Create custom light theme
const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: '#6750a4',
    primaryContainer: '#e9ddff',
    onPrimaryContainer: '#22005d',
    secondary: '#625b71',
    secondaryContainer: '#e8def8',
    onSecondaryContainer: '#1e192b',
    background: '#f7f9fc',
    surface: '#ffffff',
    text: '#1c1b1f',
    placeholder: '#6b6b6b',
  },
  roundness: 16,
  textVariants: textVariantsOverride,
  fonts: {
    ...MD3LightTheme.fonts,
    // Override specific variants that cause errors
    labelLarge: textVariantsOverride.medium,
    labelMedium: textVariantsOverride.regular,
    labelSmall: textVariantsOverride.regular,
    bodyLarge: textVariantsOverride.regular,
    bodyMedium: textVariantsOverride.regular,
    bodySmall: textVariantsOverride.regular,
    titleLarge: textVariantsOverride.bold,
    titleMedium: textVariantsOverride.medium,
    titleSmall: textVariantsOverride.medium,
    headlineLarge: textVariantsOverride.bold,
    headlineMedium: textVariantsOverride.bold,
    headlineSmall: textVariantsOverride.medium,
    displayLarge: textVariantsOverride.bold,
    displayMedium: textVariantsOverride.bold,
    displaySmall: textVariantsOverride.medium,
  }
};

// Create custom dark theme
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: '#d0bcff',
    primaryContainer: '#4f378b',
    onPrimaryContainer: '#e9ddff',
    secondary: '#ccc2dc',
    secondaryContainer: '#4a4458',
    onSecondaryContainer: '#e8def8',
    background: '#1c1b1f',
    surface: '#2d2c30',
    text: '#e6e1e5',
    placeholder: '#a6a6a6',
  },
  roundness: 16,
  textVariants: textVariantsOverride,
  fonts: {
    ...MD3DarkTheme.fonts,
    // Mirror the same overrides as in the light theme
    labelLarge: textVariantsOverride.medium,
    labelMedium: textVariantsOverride.regular,
    labelSmall: textVariantsOverride.regular,
    bodyLarge: textVariantsOverride.regular,
    bodyMedium: textVariantsOverride.regular,
    bodySmall: textVariantsOverride.regular,
    titleLarge: textVariantsOverride.bold,
    titleMedium: textVariantsOverride.medium,
    titleSmall: textVariantsOverride.medium,
    headlineLarge: textVariantsOverride.bold,
    headlineMedium: textVariantsOverride.bold,
    headlineSmall: textVariantsOverride.medium,
    displayLarge: textVariantsOverride.bold,
    displayMedium: textVariantsOverride.bold,
    displaySmall: textVariantsOverride.medium,
  }
};

export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme);
  
  useEffect(() => {
    setTheme(colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme);
  }, [colorScheme]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
              height: Platform.OS === 'ios' ? 88 : 64,
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            },
            headerTintColor: 'white',
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ 
              title: 'SnapDict',
            }}
          />
          <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{ 
              title: 'Take Photo',
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ 
              title: 'Words Found',
            }}
          />
          <Stack.Screen
            name="WordDetail"
            component={WordDetailScreen}
            options={{ 
              title: 'Word Meaning',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
