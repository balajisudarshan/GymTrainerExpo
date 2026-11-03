import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import TrainerTabNavigator from './TrainerTabNavigator';
import ClientTabNavigator from './ClientTabNavigator';
import ClientDetailScreen from '../screens/trainer/ClientDetailScreen';
import { useGym } from '../context/GymContext';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role } = useGym();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'fade',
      }}
    >
      {role === 'select' ? (
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      ) : role === 'trainer' ? (
        <>
          <Stack.Screen name="TrainerRoot" component={TrainerTabNavigator} />
          <Stack.Screen
            name="ClientDetail"
            component={ClientDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <Stack.Screen name="ClientRoot" component={ClientTabNavigator} />
      )}
    </Stack.Navigator>
  );
}

