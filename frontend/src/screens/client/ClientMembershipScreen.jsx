import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { formatINR } from '../../utils/formatters';
import { COLORS, SIZES } from '../../constants/theme';

export default function ClientMembershipScreen() {
  const { activeClient, markPaymentAsPaid, toggleSimulateExpired, setRole } = useGym();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Membership & Subscription</Text>
          <Text style={styles.subtitle}>Enrolled training details and billing</Text>
        </View>

        {/* Due Card */}
        {activeClient?.remainingAmount > 0 ? (
          <View style={styles.dueCard}>
            <View>
              <Text style={styles.dueLabel}>Next Installment Due</Text>
              <Text style={styles.dueAmount}>{formatINR(activeClient.remainingAmount)}</Text>
              <Text style={styles.dueDate}>Due on {activeClient.nextPaymentDue}</Text>
            </View>

            <TouchableOpacity
              onPress={() => markPaymentAsPaid(activeClient.id)}
              style={styles.payBtn}
            >
              <Ionicons name="card-outline" size={16} color={COLORS.textDark} />
              <Text style={styles.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.settledCard}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primaryGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settledTitle}>All Fees Settled</Text>
              <Text style={styles.settledSubtitle}>No dues pending for this 12-week cycle.</Text>
            </View>
          </View>
        )}

        {/* Plan Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enrolled Course Information</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Program</Text>
            <Text style={styles.rowVal}>{activeClient?.plan}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Start Date</Text>
            <Text style={styles.rowVal}>{activeClient?.startDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>End Date</Text>
            <Text style={styles.rowVal}>{activeClient?.endDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Fee</Text>
            <Text style={[styles.rowVal, { fontWeight: '800' }]}>{formatINR(activeClient?.totalAmount)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Paid Amount</Text>
            <Text style={[styles.rowVal, { color: COLORS.primaryGreen, fontWeight: '800' }]}>{formatINR(activeClient?.paidAmount)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Remaining</Text>
            <Text style={[styles.rowVal, { color: activeClient?.remainingAmount > 0 ? COLORS.error : COLORS.textMuted, fontWeight: '800' }]}>
              {formatINR(activeClient?.remainingAmount)}
            </Text>
          </View>
        </View>

        {/* Testing simulation button */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Demo Account Controls</Text>
          <ActionButton
            title={activeClient?.isExpired ? "Unlock Access" : "Simulate Course Expiry (Lock Screen)"}
            variant="secondary"
            icon="shield-outline"
            onPress={() => toggleSimulateExpired(activeClient?.id)}
            style={{ marginBottom: 10 }}
          />

          <ActionButton
            title="Switch Role / Home Screen"
            variant="secondary"
            icon="swap-horizontal"
            onPress={() => setRole('select')}
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
  dueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  dueLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.error,
    fontWeight: '700',
  },
  dueAmount: {
    fontSize: SIZES.font2xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  dueDate: {
    fontSize: 10.5,
    color: COLORS.textMuted,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSm,
  },
  payBtnText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  settledCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
  },
  settledTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  settledSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },
  rowVal: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
});

