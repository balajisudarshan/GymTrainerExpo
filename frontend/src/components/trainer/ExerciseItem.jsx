import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function ExerciseItem({ exercise, onToggleComplete, onDelete }) {
  return (
    <View style={[styles.card, exercise.completed && styles.cardCompleted]}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onToggleComplete}
          style={[styles.checkbox, exercise.completed && styles.checkboxCompleted]}
        >
          {exercise.completed && (
            <Ionicons name="checkmark" size={16} color={COLORS.textDark} />
          )}
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={[styles.name, exercise.completed && styles.nameCompleted]}>
            {exercise.name}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>{exercise.sets}</Text> sets × <Text style={styles.bold}>{exercise.reps}</Text>
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={[styles.detailText, { color: COLORS.primaryGreen }]}>
              {exercise.weight}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.detailText}>Rest: {exercise.rest}</Text>
          </View>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
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
  cardCompleted: {
    backgroundColor: '#0A0A0A',
    borderColor: COLORS.borderSubtle,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nameCompleted: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 4,
    fontSize: 10,
  },
  deleteBtn: {
    padding: 4,
  },
});

