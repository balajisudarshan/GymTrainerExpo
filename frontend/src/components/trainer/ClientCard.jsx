import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../common/Badge';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientCard({ client, onPress, onDelete }) {
  const isDue = client.status === 'Due';
  const isEnding = client.status === 'Ending';
  const isCompleted = client.status === 'Completed' || client.isExpired;

  let subtitle = `Week ${client.week} / ${client.totalWeeks}`;
  if (isDue) subtitle = 'Payment Due';
  if (isEnding) subtitle = 'Course Ending in 5 days';
  if (isCompleted) subtitle = 'Course Completed • Locked';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.left}>
        <View style={[styles.avatar, { borderColor: isCompleted ? COLORS.info : isDue ? COLORS.error : COLORS.primaryGreen }]}>
          <Text style={[styles.avatarText, { color: client.avatarColor || COLORS.primaryGreen }]}>
            {client.initials}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{client.name}</Text>
          <Text style={styles.meta}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Badge status={client.status} />
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={17} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.fontBase,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    padding: 4,
  },
});

