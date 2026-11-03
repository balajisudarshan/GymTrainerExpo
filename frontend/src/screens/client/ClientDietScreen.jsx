import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealItem from '../../components/trainer/MealItem';
import ExpiredLockScreen from './ExpiredLockScreen';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientDietScreen() {
  const { activeClient, selectedDay, setSelectedDay, toggleMealEaten } = useGym();

  if (activeClient?.isExpired || activeClient?.status === 'Completed') {
    return <ExpiredLockScreen client={activeClient} />;
  }

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const meals = activeClient?.diet?.[selectedDay] || [];

  const totalCals = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0);
  const totalFats = meals.reduce((sum, m) => sum + (Number(m.fats) || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header matching Panel 5 */}
        <View style={styles.header}>
          <Text style={styles.title}>Diet Plan</Text>
          <Text style={styles.subtitle}>
            {activeClient?.name} • {activeClient?.goal} • {activeClient?.targetCalories} kcal/day
          </Text>
        </View>

        {/* Weekday Selector matching Panel 5 */}
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

        {/* Meals List matching Panel 5 */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {meals.map((meal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              onToggleEaten={() => toggleMealEaten(activeClient.id, selectedDay, meal.id)}
            />
          ))}

          {/* Macro Summary breakdown */}
          <View style={styles.macroCard}>
            <Text style={styles.macroTitle}>Daily Macro Targets ({selectedDay})</Text>
            <View style={styles.macroGrid}>
              <View style={styles.macroBox}>
                <Text style={styles.macroLbl}>CALORIES</Text>
                <Text style={[styles.macroVal, { color: COLORS.primaryGreen }]}>{totalCals}</Text>
                <Text style={styles.macroSub}>/{activeClient?.targetCalories} kcal</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLbl}>PROTEIN</Text>
                <Text style={styles.macroVal}>{totalProtein}g</Text>
                <Text style={styles.macroSub}>/{activeClient?.targetProtein}g</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLbl}>CARBS</Text>
                <Text style={styles.macroVal}>{totalCarbs}g</Text>
                <Text style={styles.macroSub}>/320g</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLbl}>FATS</Text>
                <Text style={styles.macroVal}>{totalFats}g</Text>
                <Text style={styles.macroSub}>/75g</Text>
              </View>
            </View>
          </View>

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
  macroCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 10,
  },
  macroTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroBox: {
    alignItems: 'center',
  },
  macroLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  macroVal: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  macroSub: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
});

