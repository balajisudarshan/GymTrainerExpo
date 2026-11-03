import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function TrainerProfileScreen() {
  const { trainer, stats, setRole, resetAllDemoData, showToast } = useGym();

  const handleReset = () => {
    resetAllDemoData();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{trainer.avatar}</Text>
          </View>
          <Text style={styles.name}>{trainer.name}</Text>
          <Text style={styles.title}>{trainer.title}</Text>
          <Text style={styles.email}>{trainer.email}</Text>
        </View>

        {/* Coaching Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Coaching Performance</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{stats.totalClients}</Text>
              <Text style={styles.statLbl}>Clients</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: COLORS.primaryGreen }]}>{stats.activePlans}</Text>
              <Text style={styles.statLbl}>Active</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: COLORS.error }]}>{stats.paymentsDue}</Text>
              <Text style={styles.statLbl}>Dues</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: COLORS.warning }]}>{stats.coursesEnding}</Text>
              <Text style={styles.statLbl}>Ending</Text>
            </View>
          </View>
        </View>

        {/* Settings & Controls */}
        <View style={styles.menuCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="cash-outline" size={18} color={COLORS.primaryGreen} />
              <Text style={styles.menuText}>Default Billing Currency</Text>
            </View>
            <Text style={styles.menuRightText}>INR (₹)</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.menuText}>Due Alerts & Notifications</Text>
            </View>
            <Text style={[styles.menuRightText, { color: COLORS.primaryGreen }]}>Enabled</Text>
          </View>

          <TouchableOpacity
            onPress={() => setRole('select')}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="swap-horizontal-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.menuText}>Switch Role Screen</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Demo Reset Card */}
        <View style={[styles.menuCard, { borderColor: COLORS.errorBorder }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Reset Demo State</Text>
          <Text style={styles.resetDesc}>
            Clear stored localStorage/AsyncStorage modifications and restore mock data matching the reference specifications.
          </Text>
          <ActionButton
            title="Reset All Mock Data"
            variant="danger"
            icon="refresh"
            onPress={handleReset}
            style={{ marginTop: 10 }}
          />
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
    paddingTop: 14,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 2,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primaryGreen,
  },
  name: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: SIZES.fontSm,
    color: COLORS.primaryGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  email: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  menuRightText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  resetDesc: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
});

