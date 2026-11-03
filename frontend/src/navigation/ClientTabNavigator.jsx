import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import ClientWorkoutScreen from '../screens/client/ClientWorkoutScreen';
import ClientDietScreen from '../screens/client/ClientDietScreen';
import ClientProgressScreen from '../screens/client/ClientProgressScreen';
import ClientMembershipScreen from '../screens/client/ClientMembershipScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function ClientTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#050505',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primaryGreen,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Workout') iconName = focused ? 'barbell' : 'barbell-outline';
          else if (route.name === 'Diet') iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'Progress') iconName = focused ? 'trending-up' : 'trending-up-outline';
          else if (route.name === 'Membership') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ClientHomeScreen} />
      <Tab.Screen name="Workout" component={ClientWorkoutScreen} />
      <Tab.Screen name="Diet" component={ClientDietScreen} />
      <Tab.Screen name="Progress" component={ClientProgressScreen} />
      <Tab.Screen name="Membership" component={ClientMembershipScreen} />
    </Tab.Navigator>
  );
}
