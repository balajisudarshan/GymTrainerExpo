import React, { useState } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../common/ActionButton';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function AddClientModal({ visible, onClose }) {
  const { addClient } = useGym();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [age, setAge] = useState('24');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState('78');
  const [goal, setGoal] = useState('Muscle Gain');
  const [totalWeeks, setTotalWeeks] = useState('12');
  const [totalAmount, setTotalAmount] = useState('12000');
  const [paidAmount, setPaidAmount] = useState('9000');
  const [targetCalories, setTargetCalories] = useState('2800');
  const [targetProtein, setTargetProtein] = useState('165');

  const handleSubmit = () => {
    if (!name.trim()) return;
    addClient({
      name,
      age,
      gender,
      weight,
      goal,
      totalWeeks,
      totalAmount,
      paidAmount,
      targetCalories,
      targetProtein,
    });
    setName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="person-add" size={16} color={COLORS.primaryGreen} />
              </View>
              <Text style={styles.headerTitle}>Add New Client</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            {/* Goal selection pills */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Fitness Goal</Text>
              <View style={styles.pillsRow}>
                {['Muscle Gain', 'Fat Loss', 'Strength', 'Recomp'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGoal(g)}
                    style={[styles.pill, goal === g && styles.pillActive]}
                  >
                    <Text style={[styles.pillText, goal === g && styles.pillTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Program Duration</Text>
              <View style={styles.pillsRow}>
                {['8', '12', '16', '24'].map((w) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setTotalWeeks(w)}
                    style={[styles.pill, totalWeeks === w && styles.pillActive]}
                  >
                    <Text style={[styles.pillText, totalWeeks === w && styles.pillTextActive]}>{w} Weeks</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fees in INR */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Total Fee (₹ INR)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Advance Paid (₹ INR)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={paidAmount}
                  onChangeText={setPaidAmount}
                />
              </View>
            </View>

            {/* Nutrition Targets */}
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Daily Target (kcal)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={targetCalories}
                  onChangeText={setTargetCalories}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Target Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={targetProtein}
                  onChangeText={setTargetProtein}
                />
              </View>
            </View>

            {/* Submit CTA */}
            <View style={styles.buttonRow}>
              <ActionButton
                title="Cancel"
                variant="secondary"
                onPress={onClose}
                style={{ flex: 1 }}
              />
              <ActionButton
                title="Register Client"
                variant="primary"
                onPress={handleSubmit}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.paddingLg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.greenMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
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
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: COLORS.primaryGreen,
  },
  pillText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: COLORS.textDark,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
});

