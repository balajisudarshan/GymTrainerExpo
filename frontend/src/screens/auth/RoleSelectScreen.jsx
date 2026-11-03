import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ActionButton from '../../components/common/ActionButton';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function RoleSelectScreen() {
  const { setRole, setActiveClientId, showToast } = useGym();

  const handleTrainerLogin = () => {
    setRole('trainer');
    showToast('Signed in as Coach Balaji (Head Trainer)');
  };

  const handleClientLogin = (clientId = 'c1') => {
    setActiveClientId(clientId);
    setRole('client');
    showToast('Signed in as Adithya R. (Client)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      {/* Background ambient lighting */}
      <View style={styles.glowTopRight} />

      <View style={styles.container}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="barbell" size={20} color={COLORS.primaryGreen} />
          </View>
          <Text style={styles.brandText}>FitCoach</Text>
          <View style={styles.proTag}>
            <Text style={styles.proTagText}>PRO</Text>
          </View>
        </View>

        {/* Hero Visual Card matching Panel 1 */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(139, 255, 54, 0.15)', 'rgba(16, 16, 16, 0.95)', '#101010']}
            style={styles.gradientCard}
          >
            {/* Center Athlete / Dumbbell Graphic */}
            <View style={styles.iconCircle}>
              <Ionicons name="barbell" size={48} color={COLORS.primaryGreen} />
            </View>

            {/* Typography matching Panel 1 */}
            <Text style={styles.heading}>
              Manage{'\n'}
              Clients.{'\n'}
              Plans.{'\n'}
              <Text style={styles.headingAccent}>Progress.</Text>
            </Text>

            <Text style={styles.description}>
              A complete platform for trainers to assign workouts, diets, and manage clients.
            </Text>
          </LinearGradient>
        </View>

        {/* Action Buttons matching Panel 1 */}
        <View style={styles.buttonContainer}>
          {/* Trainer Login -> */}
          <ActionButton
            title="Trainer Login"
            variant="primary"
            icon="arrow-forward"
            iconPosition="right"
            onPress={handleTrainerLogin}
            style={styles.mainButton}
          />

          {/* Client Login */}
          <ActionButton
            title="Client Login"
            variant="secondary"
            icon="person-outline"
            onPress={() => handleClientLogin('c1')}
            style={styles.secondaryButton}
          />

          {/* Demo shortcut for Expired / Locked Screen Preview */}
          <TouchableOpacity
            onPress={() => {
              setActiveClientId('c5');
              setRole('client');
              showToast('Previewing Vikram Sethi (Course Completed / Locked Screen)');
            }}
            style={styles.expiredDemoButton}
          >
            <Ionicons name="lock-closed" size={13} color={COLORS.textMuted} />
            <Text style={styles.expiredDemoText}>Preview Course Completed Lock Screen (Demo)</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  glowTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(139, 255, 54, 0.08)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.greenMuted,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  proTag: {
    backgroundColor: COLORS.cardHighlight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proTagText: {
    color: COLORS.primaryGreen,
    fontSize: 10,
    fontWeight: '800',
  },
  heroCard: {
    flex: 1,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginVertical: 14,
  },
  gradientCard: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.greenBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  heading: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 44,
    letterSpacing: -1,
  },
  headingAccent: {
    color: COLORS.primaryGreen,
  },
  description: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 14,
    maxWidth: '90%',
  },
  buttonContainer: {
    gap: 10,
  },
  mainButton: {
    paddingVertical: 14,
  },
  secondaryButton: {
    paddingVertical: 14,
  },
  expiredDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  expiredDemoText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

