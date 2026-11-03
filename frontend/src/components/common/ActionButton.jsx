import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';

export default function ActionButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  iconPosition = 'left',
  style, 
  textStyle 
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  let containerStyle = styles.primaryButton;
  let labelStyle = styles.primaryText;
  let defaultIconColor = COLORS.textDark;

  if (variant === 'secondary') {
    containerStyle = styles.secondaryButton;
    labelStyle = styles.secondaryText;
    defaultIconColor = COLORS.textPrimary;
  } else if (isDanger) {
    containerStyle = styles.dangerButton;
    labelStyle = styles.dangerText;
    defaultIconColor = COLORS.error;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.baseButton, containerStyle, style]}
    >
      {icon && iconPosition === 'left' && (
        <Ionicons name={icon} size={18} color={defaultIconColor} style={{ marginRight: 8 }} />
      )}
      <Text style={[styles.baseText, labelStyle, textStyle]}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <Ionicons name={icon} size={18} color={defaultIconColor} style={{ marginLeft: 8 }} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: SIZES.radiusSm,
  },
  baseText: {
    fontSize: SIZES.fontBase,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryGreen,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryText: {
    color: COLORS.textDark,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardSurface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
  dangerButton: {
    backgroundColor: COLORS.errorMuted,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  dangerText: {
    color: COLORS.error,
  },
});

