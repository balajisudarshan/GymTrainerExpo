import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExerciseItem from '../../components/trainer/ExerciseItem';
import ExpiredLockScreen from './ExpiredLockScreen';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientWorkoutScreen() {
  const { activeClient, selectedDay, setSelectedDay, toggleExerciseCompleted } = useGym();

  if (activeClient?.isExpired || activeClient?.status === 'Completed') {
    return <ExpiredLockScreen client={activeClient} />;
  }

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const exercises = activeClient?.workouts?.[selectedDay] || [];
  const completedCount = exercises.filter((e) => e.completed).length;
  const progressPercent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout Schedule</Text>
          <Text style={styles.subtitle}>Check off exercises as you finish your sets</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{selectedDay}'s Completion</Text>
            <Text style={styles.progressValue}>{progressPercent}% ({completedCount}/{exercises.length})</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Day Selector */}
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

        {/* Exercises */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {exercises.map((ex) => (
            <ExerciseItem
              key={ex.id}
              exercise={ex}
              onToggleComplete={() => toggleExerciseCompleted(activeClient.id, selectedDay, ex.id)}
            />
          ))}

          {exercises.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Rest day! Enjoy your recovery.</Text>
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
  progressCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    padding: 12,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: SIZES.fontXs,
    color: COLORS.primaryGreen,
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primaryGreen,
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
    padding: 30,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSm,
  },
});

