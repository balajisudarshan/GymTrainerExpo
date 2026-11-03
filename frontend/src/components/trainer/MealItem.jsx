import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function MealItem({ meal, onToggleEaten, onDelete }) {
  let iconName = 'restaurant';
  if (meal.name === 'Breakfast') iconName = 'sunny';
  else if (meal.name === 'Mid Meal') iconName = 'cafe';
  else if (meal.name === 'Lunch') iconName = 'fast-food';
  else if (meal.name === 'Evening Snack') iconName = 'nutrition';
  else if (meal.name === 'Dinner') iconName = 'moon';

  return (
    <View style={[styles.card, meal.eaten && styles.cardEaten]}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={18} color={COLORS.primaryGreen} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {meal.name} <Text style={styles.time}>• {meal.time}</Text>
          </Text>
          <Text style={styles.items} numberOfLines={1}>{meal.items}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.calories}>= {meal.calories} kcal</Text>

        {onToggleEaten && (
          <TouchableOpacity
            onPress={onToggleEaten}
            style={[styles.checkbox, meal.eaten && styles.checkboxEaten]}
          >
            {meal.eaten && <Ionicons name="checkmark" size={14} color={COLORS.textDark} />}
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  cardEaten: {
    borderColor: COLORS.greenBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  items: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calories: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEaten: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  deleteBtn: {
    padding: 2,
  },
});

