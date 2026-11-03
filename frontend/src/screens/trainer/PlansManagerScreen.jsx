import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExerciseItem from '../../components/trainer/ExerciseItem';
import MealItem from '../../components/trainer/MealItem';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function PlansManagerScreen({ navigation }) {
  const { 
    clients, 
    activeClientId, 
    setActiveClientId, 
    activeClient, 
    selectedDay, 
    setSelectedDay,
    toggleExerciseCompleted,
    toggleMealEaten 
  } = useGym();

  const [planType, setPlanType] = useState('workout'); // 'workout' | 'diet'
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const exercises = activeClient?.workouts?.[selectedDay] || [];
  const meals = activeClient?.diet?.[selectedDay] || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Plans Planner</Text>
          <Text style={styles.subtitle}>
            Assigning for: <Text style={{ color: COLORS.primaryGreen, fontWeight: '700' }}>{activeClient?.name}</Text>
          </Text>
        </View>

        {/* Client selector pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientScroll}>
          {clients.slice(0, 8).map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setActiveClientId(c.id)}
              style={[styles.clientPill, activeClientId === c.id && styles.clientPillActive]}
            >
              <Text style={[styles.clientPillText, activeClientId === c.id && styles.clientPillTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Plan Type Tabs: Workout vs Diet */}
        <View style={styles.switchTabs}>
          <TouchableOpacity
            onPress={() => setPlanType('workout')}
            style={[styles.switchTab, planType === 'workout' && styles.switchTabActive]}
          >
            <Ionicons name="barbell-outline" size={16} color={planType === 'workout' ? COLORS.textDark : COLORS.textSecondary} />
            <Text style={[styles.switchTabText, planType === 'workout' && styles.switchTabTextActive]}>
              Workouts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPlanType('diet')}
            style={[styles.switchTab, planType === 'diet' && styles.switchTabActive]}
          >
            <Ionicons name="restaurant-outline" size={16} color={planType === 'diet' ? COLORS.textDark : COLORS.textSecondary} />
            <Text style={[styles.switchTabText, planType === 'diet' && styles.switchTabTextActive]}>
              Diet & Meals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekday Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayPill, selectedDay === day && styles.dayPillActive]}
            >
              <Text style={[styles.dayPillText, selectedDay === day && styles.dayPillTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List of items */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {planType === 'workout' ? (
            <View>
              {exercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  exercise={ex}
                  onToggleComplete={() => toggleExerciseCompleted(activeClient.id, selectedDay, ex.id)}
                />
              ))}
              {exercises.length === 0 && (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No exercises for {selectedDay}.</Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {meals.map((meal) => (
                <MealItem
                  key={meal.id}
                  meal={meal}
                  onToggleEaten={() => toggleMealEaten(activeClient.id, selectedDay, meal.id)}
                />
              ))}
              {meals.length === 0 && (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>No meals scheduled for {selectedDay}.</Text>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.paddingMd,
    paddingTop: 10,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clientScroll: {
    maxHeight: 38,
    marginBottom: 12,
  },
  clientPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  clientPillActive: {
    borderColor: COLORS.primaryGreen,
    backgroundColor: COLORS.greenMuted,
  },
  clientPillText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  clientPillTextActive: {
    color: COLORS.primaryGreen,
  },
  switchTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 4,
  },
  switchTabActive: {
    backgroundColor: COLORS.primaryGreen,
  },
  switchTabText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  switchTabTextActive: {
    color: COLORS.textDark,
  },
  dayScroll: {
    maxHeight: 38,
    marginBottom: 14,
  },
  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  dayPillActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  dayPillText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayPillTextActive: {
    color: COLORS.textDark,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSm,
  },
});

