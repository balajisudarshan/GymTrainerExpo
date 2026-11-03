import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GymProvider } from './src/context/GymContext';
import AppNavigator from './src/navigation/AppNavigator';
import ToastNotification from './src/components/common/ToastNotification';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <GymProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#050505" />
            <AppNavigator />
            <ToastNotification />
          </NavigationContainer>
        </GymProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
  },
});
