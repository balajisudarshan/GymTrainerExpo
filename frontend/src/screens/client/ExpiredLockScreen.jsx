import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ExpiredLockScreen({ client }) {
  const { renewMembership, toggleSimulateExpired, showToast } = useGym();
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Background radial glow effect */}
      <View style={styles.glowCircle} />

      <View style={styles.container}>
        {/* Glowing Neon Lock Card matching Panel 7 */}
        <View style={styles.lockBox}>
          <Ionicons name="lock-closed" size={38} color={COLORS.primaryGreen} />
        </View>

        {/* Heading matching Panel 7 */}
        <Text style={styles.heading}>Course Completed</Text>

        {/* Subtitle matching Panel 7 */}
        <Text style={styles.description}>
          Your 12-week program has been completed.{'\n'}
          Contact your trainer to start a new plan.
        </Text>

        {/* Highlights summary pill */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PROGRAM</Text>
            <Text style={styles.summaryVal}>{client?.plan || '12-Week Recomp'}</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PROGRESS</Text>
            <Text style={[styles.summaryVal, { color: COLORS.primaryGreen }]}>{client?.progress || '+14.8%'}</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>STATUS</Text>
            <Text style={[styles.summaryVal, { color: COLORS.error }]}>Locked</Text>
          </View>
        </View>

        {/* Buttons matching Panel 7 */}
        <View style={styles.buttonStack}>
          {/* Renew / Start New Plan -> */}
          <ActionButton
            title="Renew / Start New Plan"
            variant="primary"
            icon="arrow-forward"
            iconPosition="right"
            onPress={() => setRenewModalVisible(true)}
            style={styles.renewBtn}
          />

          {/* Message Trainer */}
          <ActionButton
            title="Message Trainer"
            variant="secondary"
            icon="chatbubble-outline"
            onPress={() => setMessageModalVisible(true)}
            style={styles.messageBtn}
          />
        </View>

        {/* Simulator toggle hint */}
        <TouchableOpacity
          onPress={() => toggleSimulateExpired(client?.id)}
          style={styles.simToggle}
        >
          <Ionicons name="shield-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.simToggleText}>(Demo Simulator: Tap to Unlock Access)</Text>
        </TouchableOpacity>
      </View>

      {/* Renew Modal */}
      <Modal visible={renewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Renew Training Plan</Text>
            <Text style={styles.modalSub}>
              Select new enrollment phase to immediately unlock workouts and diet plans.
            </Text>

            <View style={{ gap: 8, marginVertical: 14 }}>
              <TouchableOpacity
                onPress={() => {
                  renewMembership(client.id, 12, 12000);
                  setRenewModalVisible(false);
                }}
                style={styles.planOption}
              >
                <Text style={styles.planOptionTitle}>12 Weeks Hyper-Growth Phase</Text>
                <Text style={styles.planOptionPrice}>₹12,000</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  renewMembership(client.id, 16, 15000);
                  setRenewModalVisible(false);
                }}
                style={styles.planOption}
              >
                <Text style={styles.planOptionTitle}>16 Weeks Elite Transformation</Text>
                <Text style={styles.planOptionPrice}>₹15,000</Text>
              </TouchableOpacity>
            </View>

            <ActionButton
              title="Close"
              variant="secondary"
              onPress={() => setRenewModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Message Trainer Dialog */}
      <Modal visible={messageModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Message Coach Balaji</Text>
            <Text style={styles.modalSub}>
              "Hi Coach Balaji, I've completed my 12-week program (+{client?.progress || '14.8%'}). I want to book my next phase!"
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <ActionButton
                title="Cancel"
                variant="secondary"
                onPress={() => setMessageModalVisible(false)}
                style={{ flex: 1 }}
              />
              <ActionButton
                title="Send WhatsApp"
                variant="primary"
                icon="logo-whatsapp"
                onPress={() => {
                  showToast('Message sent to Coach Balaji via WhatsApp simulation!');
                  setMessageModalVisible(false);
                }}
                style={{ flex: 1 }}
              />
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
  glowCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(139, 255, 54, 0.1)',
    top: '25%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  lockBox: {
    width: 78,
    height: 78,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  heading: {
    fontSize: SIZES.font2xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 28,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryVal: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  buttonStack: {
    width: '100%',
    gap: 12,
  },
  renewBtn: {
    paddingVertical: 14,
  },
  messageBtn: {
    paddingVertical: 14,
  },
  simToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  simToggleText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  modalTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  planOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    padding: 14,
    borderRadius: SIZES.radiusSm,
  },
  planOptionTitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  planOptionPrice: {
    fontSize: SIZES.fontSm,
    color: COLORS.primaryGreen,
    fontWeight: '800',
  },
});

