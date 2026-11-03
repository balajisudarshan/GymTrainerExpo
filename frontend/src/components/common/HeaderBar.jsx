import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function HeaderBar({ title, showBack = false, onBack }) {
  const { 
    role, 
    setRole, 
    trainer, 
    clients, 
    activeClientId, 
    setActiveClientId, 
    activeClient, 
    toggleSimulateExpired,
    resetAllDemoData,
    showToast 
  } = useGym();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Left: Brand or Back */}
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="barbell" size={15} color={COLORS.primaryGreen} />
            </View>
            <Text style={styles.brandTitle}>FitCoach</Text>
          </View>
        )}
      </View>

      {/* Center: Role Switcher Capsule */}
      <View style={styles.roleCapsule}>
        <TouchableOpacity
          onPress={() => setRole('trainer')}
          style={[styles.roleTab, role === 'trainer' && styles.roleTabActive]}
        >
          <Text style={[styles.roleTabText, role === 'trainer' && styles.roleTabTextActive]}>
            Trainer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRole('client')}
          style={[styles.roleTab, role === 'client' && styles.roleTabActive]}
        >
          <Text style={[styles.roleTabText, role === 'client' && styles.roleTabTextActive]}>
            Client
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right: Quick Menu & Profile */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.avatarButton}
        >
          <Text style={styles.avatarText}>
            {role === 'trainer' ? trainer.avatar : (activeClient?.initials || 'C')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Demo Switcher & Simulation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FitCoach Demo Controls</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionSubtitle}>SELECT ACTIVE CLIENT PREVIEW:</Text>
            
            {/* Adithya R. (Active) */}
            <TouchableOpacity
              onPress={() => {
                setActiveClientId('c1');
                setRole('client');
                setModalVisible(false);
                showToast('Switched to Adithya R. (Active Client)');
              }}
              style={[styles.clientSelectRow, activeClientId === 'c1' && styles.clientSelectActive]}
            >
              <View>
                <Text style={styles.clientSelectName}>Adithya R.</Text>
                <Text style={styles.clientSelectMeta}>Week 3/12 • Muscle Gain • ₹3,000 Due</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: COLORS.greenMuted }]}>
                <Text style={{ color: COLORS.primaryGreen, fontSize: 10, fontWeight: '700' }}>Active</Text>
              </View>
            </TouchableOpacity>

            {/* Vikram Sethi (Course Completed / Lock Screen) */}
            <TouchableOpacity
              onPress={() => {
                setActiveClientId('c5');
                setRole('client');
                setModalVisible(false);
                showToast('Switched to Vikram Sethi (Course Completed / Locked)');
              }}
              style={[styles.clientSelectRow, activeClientId === 'c5' && styles.clientSelectActive]}
            >
              <View>
                <Text style={[styles.clientSelectName, { color: COLORS.error }]}>Vikram Sethi</Text>
                <Text style={styles.clientSelectMeta}>12 Weeks Completed • Locked Screen</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: COLORS.errorMuted }]}>
                <Text style={{ color: COLORS.error, fontSize: 10, fontWeight: '700' }}>Locked</Text>
              </View>
            </TouchableOpacity>

            {/* Sai Teja (Due) */}
            <TouchableOpacity
              onPress={() => {
                setActiveClientId('c3');
                setRole('client');
                setModalVisible(false);
                showToast('Switched to Sai Teja (Payment Due)');
              }}
              style={[styles.clientSelectRow, activeClientId === 'c3' && styles.clientSelectActive]}
            >
              <View>
                <Text style={styles.clientSelectName}>Sai Teja</Text>
                <Text style={styles.clientSelectMeta}>Week 4/8 • ₹5,000 Due</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: COLORS.errorMuted }]}>
                <Text style={{ color: COLORS.error, fontSize: 10, fontWeight: '700' }}>Due</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            {/* Toggle Simulator Expiry for current client */}
            <TouchableOpacity
              onPress={() => {
                toggleSimulateExpired(activeClientId);
                setModalVisible(false);
              }}
              style={styles.actionRow}
            >
              <Ionicons name="shield-outline" size={18} color={activeClient?.isExpired ? COLORS.primaryGreen : COLORS.error} />
              <Text style={[styles.actionRowText, { color: activeClient?.isExpired ? COLORS.primaryGreen : COLORS.error }]}>
                {activeClient?.isExpired ? 'Unlock Current Client' : 'Simulate Course Expired Lock'}
              </Text>
            </TouchableOpacity>

            {/* Reset All Data */}
            <TouchableOpacity
              onPress={() => {
                resetAllDemoData();
                setModalVisible(false);
              }}
              style={styles.actionRow}
            >
              <Ionicons name="refresh-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.actionRowText}>Reset Demo Data to Initial</Text>
            </TouchableOpacity>

            {/* Switch to Select / Landing */}
            <TouchableOpacity
              onPress={() => {
                setRole('select');
                setModalVisible(false);
              }}
              style={styles.actionRow}
            >
              <Ionicons name="log-out-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.actionRowText}>Switch Role Screen</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingMd,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.greenMuted,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCapsule: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  roleTab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleTabActive: {
    backgroundColor: COLORS.primaryGreen,
  },
  roleTabText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleTabTextActive: {
    color: COLORS.textDark,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarButton: {
    width: 30,
    height: 30,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cardHighlight,
    borderWidth: 1,
    borderColor: COLORS.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.primaryGreen,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  clientSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  clientSelectActive: {
    borderColor: COLORS.primaryGreen,
  },
  clientSelectName: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clientSelectMeta: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  actionRowText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});

