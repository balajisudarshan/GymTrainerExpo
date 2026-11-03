import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../../components/common/HeaderBar';
import MetricStatCard from '../../components/common/MetricStatCard';
import ExerciseItem from '../../components/trainer/ExerciseItem';
import MealItem from '../../components/trainer/MealItem';
import ExpiredLockScreen from './ExpiredLockScreen';
import { useGym } from '../../context/GymContext';
import { formatINR } from '../../utils/formatters';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientHomeScreen({ navigation }) {
  const { 
    activeClient, 
    selectedDay, 
    toggleExerciseCompleted, 
    toggleMealEaten,
    markPaymentAsPaid 
  } = useGym();

  // If the client's membership is expired / completed, lock the screens and show Panel 7!
  if (activeClient?.isExpired || activeClient?.status === 'Completed') {
    return <ExpiredLockScreen client={activeClient} />;
  }

  const todayWorkouts = activeClient?.workouts?.[selectedDay] || [];
  const todayMeals = activeClient?.diet?.[selectedDay] || [];

  const completedCount = todayWorkouts.filter((ex) => ex.completed).length;
  const eatenCals = todayMeals.filter((m) => m.eaten).reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const eatenProtein = todayMeals.filter((m) => m.eaten).reduce((sum, m) => sum + (Number(m.protein) || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderBar />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Greeting */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeRow}>
            <Text style={styles.welcomeTitle}>Welcome back, {activeClient?.name} 👋</Text>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>Week {activeClient?.week}/{activeClient?.totalWeeks}</Text>
            </View>
          </View>
          <Text style={styles.welcomeSubtitle}>
            Goal: <Text style={{ color: COLORS.textPrimary, fontWeight: '700' }}>{activeClient?.goal}</Text> • Coach Balaji
          </Text>
        </View>

        {/* 4 KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            <MetricStatCard
              icon="flame-outline"
              value={`${eatenCals}`}
              label={`/${activeClient?.targetCalories} kcal eaten`}
              iconColor={COLORS.primaryGreen}
            />
            <MetricStatCard
              icon="restaurant-outline"
              value={`${eatenProtein}g`}
              label={`/${activeClient?.targetProtein}g protein`}
              iconColor={COLORS.primaryGreen}
            />
          </View>

          <View style={styles.kpiRow}>
            <MetricStatCard
              icon="barbell-outline"
              value={`${completedCount}/${todayWorkouts.length}`}
              label="Exercises done"
              iconColor={COLORS.primaryGreen}
            />
            <MetricStatCard
              icon="speedometer-outline"
              value={`${activeClient?.weight} kg`}
              label={activeClient?.progress}
              iconColor={COLORS.primaryGreen}
            />
          </View>
        </View>

        {/* Payment Due Banner if applicable */}
        {activeClient?.remainingAmount > 0 && (
          <View style={styles.dueAlertCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dueAlertLabel}>Upcoming Installment Due</Text>
              <Text style={styles.dueAlertAmount}>{formatINR(activeClient.remainingAmount)}</Text>
              <Text style={styles.dueAlertDate}>Due: {activeClient.nextPaymentDue}</Text>
            </View>

            <TouchableOpacity
              onPress={() => markPaymentAsPaid(activeClient.id)}
              style={styles.payNowBtn}
            >
              <Text style={styles.payNowBtnText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Workout Routine Checklist */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{selectedDay}'s Workout</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workout')}>
              <Text style={styles.sectionLink}>Full Routine →</Text>
            </TouchableOpacity>
          </View>

          {todayWorkouts.slice(0, 3).map((ex) => (
            <ExerciseItem
              key={ex.id}
              exercise={ex}
              onToggleComplete={() => toggleExerciseCompleted(activeClient.id, selectedDay, ex.id)}
            />
          ))}
        </View>

        {/* Today's Diet & Meals */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{selectedDay}'s Nutrition</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Diet')}>
              <Text style={styles.sectionLink}>Diet Plan →</Text>
            </TouchableOpacity>
          </View>

          {todayMeals.slice(0, 3).map((meal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              onToggleEaten={() => toggleMealEaten(activeClient.id, selectedDay, meal.id)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  welcomeSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  weekBadge: {
    backgroundColor: COLORS.greenMuted,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
  },
  weekBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primaryGreen,
  },
  welcomeSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  kpiGrid: {
    marginBottom: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dueAlertCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    marginBottom: 14,
  },
  dueAlertLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.error,
    fontWeight: '700',
  },
  dueAlertAmount: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  dueAlertDate: {
    fontSize: 10.5,
    color: COLORS.textMuted,
  },
  payNowBtn: {
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSm,
  },
  payNowBtnText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionLink: {
    fontSize: SIZES.fontXs,
    color: COLORS.primaryGreen,
    fontWeight: '600',
  },
});

