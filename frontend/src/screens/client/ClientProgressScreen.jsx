import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExpiredLockScreen from './ExpiredLockScreen';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientProgressScreen() {
  const { activeClient } = useGym();

  if (activeClient?.isExpired || activeClient?.status === 'Completed') {
    return <ExpiredLockScreen client={activeClient} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Fitness Journey</Text>
          <Text style={styles.subtitle}>Track weight shifts and weekly consistency</Text>
        </View>

        {/* Current Metrics Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>STARTING</Text>
            <Text style={styles.metricVal}>75.8 kg</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>CURRENT</Text>
            <Text style={[styles.metricVal, { color: COLORS.primaryGreen }]}>{activeClient?.weight} kg</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>GOAL</Text>
            <Text style={styles.metricVal}>{activeClient?.targetWeight} kg</Text>
          </View>
        </View>

        {/* Weight logs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weight Check-in History</Text>
          {(activeClient?.weightHistory || []).map((w, idx) => (
            <View key={idx} style={styles.logRow}>
              <View style={styles.logLeft}>
                <Ionicons name="scale-outline" size={16} color={COLORS.primaryGreen} />
                <Text style={styles.logWeek}>{w.week} Log</Text>
              </View>
              <Text style={styles.logWeight}>{w.weight} kg</Text>
            </View>
          ))}
        </View>

        {/* Coach feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coach Balaji's Observations</Text>
          <Text style={styles.coachNote}>{activeClient?.notes}</Text>
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
    paddingTop: 10,
  },
  header: {
    marginBottom: 14,
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
  metricCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  metricVal: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logWeek: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  logWeight: {
    fontSize: SIZES.fontSm,
    color: COLORS.primaryGreen,
    fontWeight: '700',
  },
  coachNote: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

