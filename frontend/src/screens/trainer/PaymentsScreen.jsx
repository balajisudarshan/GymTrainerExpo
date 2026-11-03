import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { formatINR } from '../../utils/formatters';
import { COLORS, SIZES } from '../../constants/theme';

export default function PaymentsScreen() {
  const { clients, markPaymentAsPaid, recordPayment } = useGym();
  const insets = useSafeAreaInsets();

  const [filterDuesOnly, setFilterDuesOnly] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClientForPay, setSelectedClientForPay] = useState(clients[0]?.id || 'c1');
  const [amountInput, setAmountInput] = useState('3000');
  const [noteInput, setNoteInput] = useState('Installment payment');

  const totalCollected = clients.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const totalOutstanding = clients.reduce((sum, c) => sum + (c.remainingAmount || 0), 0);
  const duesCount = clients.filter((c) => c.remainingAmount > 0).length;

  const displayClients = filterDuesOnly
    ? clients.filter((c) => c.remainingAmount > 0)
    : clients;

  const handleRecordSubmit = () => {
    if (!amountInput) return;
    recordPayment(selectedClientForPay, Number(amountInput), noteInput, 'UPI');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Payment Management</Text>
            <Text style={styles.subtitle}>Track revenue and dues in INR (₹)</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.recordBtn}
          >
            <Ionicons name="add" size={16} color={COLORS.textDark} />
            <Text style={styles.recordBtnText}>Record</Text>
          </TouchableOpacity>
        </View>

        {/* Top 2 KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
            <Text style={styles.kpiValueGreen}>{formatINR(totalCollected)}</Text>
            <Text style={styles.kpiMeta}>From {clients.length} clients</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: totalOutstanding > 0 ? COLORS.errorBorder : COLORS.border }]}>
            <Text style={styles.kpiLabel}>PENDING DUES</Text>
            <Text style={styles.kpiValueRed}>{formatINR(totalOutstanding)}</Text>
            <Text style={styles.kpiMeta}>{duesCount} accounts due</Text>
          </View>
        </View>

        {/* Filter Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setFilterDuesOnly(true)}
            style={[styles.toggleBtn, filterDuesOnly && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, filterDuesOnly && styles.toggleTextActive]}>
              Pending Dues ({duesCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterDuesOnly(false)}
            style={[styles.toggleBtn, !filterDuesOnly && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, !filterDuesOnly && styles.toggleTextActive]}>
              All Roster ({clients.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ledger list */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {displayClients.map((client) => {
            const hasDue = client.remainingAmount > 0;
            return (
              <View key={client.id} style={styles.clientPayCard}>
                <View style={styles.cardTop}>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientPlan}>{client.plan}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.dueAmount, { color: hasDue ? COLORS.error : COLORS.primaryGreen }]}>
                      {hasDue ? formatINR(client.remainingAmount) : 'Paid in Full'}
                    </Text>
                    <Text style={styles.dueSub}>
                      {hasDue ? `Due: ${client.nextPaymentDue}` : 'Settled'}
                    </Text>
                  </View>
                </View>

                {/* Progress bar of payment */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${Math.min(100, Math.round((client.paidAmount / client.totalAmount) * 100))}%` },
                    ]}
                  />
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.feeBreakdown}>
                    Paid {formatINR(client.paidAmount)} of {formatINR(client.totalAmount)}
                  </Text>

                  {hasDue ? (
                    <TouchableOpacity
                      onPress={() => markPaymentAsPaid(client.id)}
                      style={styles.markPaidButton}
                    >
                      <Ionicons name="checkmark-circle" size={14} color={COLORS.textDark} />
                      <Text style={styles.markPaidButtonText}>Mark as Paid</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.settledBadge}>
                      <Ionicons name="checkmark" size={12} color={COLORS.primaryGreen} />
                      <Text style={styles.settledBadgeText}>Settled</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      {/* Record Payment Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20 }]}>
            <Text style={styles.modalTitle}>Record Manual Payment</Text>
            
            <Text style={styles.inputLabel}>Client Account</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 38, marginBottom: 12 }}>
              {clients.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    setSelectedClientForPay(c.id);
                    setAmountInput(String(c.remainingAmount || 3000));
                  }}
                  style={[styles.clientChip, selectedClientForPay === c.id && styles.clientChipActive]}
                >
                  <Text style={[styles.clientChipText, selectedClientForPay === c.id && styles.clientChipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Payment Amount (₹ INR)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <Text style={styles.inputLabel}>Note / Reference</Text>
            <TextInput
              style={styles.input}
              value={noteInput}
              onChangeText={setNoteInput}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <ActionButton title="Cancel" variant="secondary" onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
              <ActionButton title="Save Payment" variant="primary" onPress={handleRecordSubmit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusSm,
  },
  recordBtnText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  kpiValueGreen: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.primaryGreen,
    marginTop: 4,
  },
  kpiValueRed: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.error,
    marginTop: 4,
  },
  kpiMeta: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.cardSurface,
  },
  toggleText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  clientPayCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: SIZES.fontBase,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clientPlan: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dueAmount: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
  },
  dueSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.cardSurface,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primaryGreen,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeBreakdown: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
  },
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
  },
  markPaidButtonText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.greenMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  settledBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primaryGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  modalTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: SIZES.fontSm,
    marginBottom: 12,
  },
  clientChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  clientChipActive: {
    borderColor: COLORS.primaryGreen,
    backgroundColor: COLORS.greenMuted,
  },
  clientChipText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  clientChipTextActive: {
    color: COLORS.primaryGreen,
  },
});

