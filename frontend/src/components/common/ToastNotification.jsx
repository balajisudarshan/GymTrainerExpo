import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGym } from '../../context/GymContext';
import { COLORS, SIZES } from '../../constants/theme';

export default function ToastNotification() {
  const { toast } = useGym();
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const bottomPosition = 64 + (insets.bottom > 0 ? insets.bottom : 12);

  return (
    <View style={[
      styles.container, 
      { bottom: bottomPosition },
      isError ? styles.errorBorder : styles.successBorder
    ]}>
      <Ionicons
        name={isError ? 'alert-circle' : 'checkmark-circle'}
        size={18}
        color={isError ? COLORS.error : COLORS.primaryGreen}
      />
      <Text style={styles.text}>{toast.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  successBorder: {
    borderColor: COLORS.primaryGreen,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    flex: 1,
  },
});
