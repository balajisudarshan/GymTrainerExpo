import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function QuickActionsRow({ onAddClient, onAssignPlan, onAddDiet, onRecordPayment }) {
  const actions = [
    { id: '1', title: 'Add New Client', icon: 'person-add-outline', color: COLORS.primaryGreen, onPress: onAddClient },
    { id: '2', title: 'Assign Plan', icon: 'barbell-outline', color: COLORS.textSecondary, onPress: onAssignPlan },
    { id: '3', title: 'Add Diet Plan', icon: 'restaurant-outline', color: COLORS.textSecondary, onPress: onAddDiet },
    { id: '4', title: 'Record Payment', icon: 'card-outline', color: COLORS.textSecondary, onPress: onRecordPayment },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Quick Actions</Text>
      
      <View style={styles.list}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            activeOpacity={0.7}
            onPress={act.onPress}
            style={styles.actionItem}
          >
            <View style={styles.actionLeft}>
              <Ionicons name={act.icon} size={17} color={act.color} />
              <Text style={[styles.actionText, act.id === '1' && { fontWeight: '700', color: COLORS.textPrimary }]}>
                {act.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

