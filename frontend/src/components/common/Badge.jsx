import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function Badge({ status, text, style }) {
  const label = text || status;

  let bg = COLORS.greenMuted;
  let border = COLORS.greenBorder;
  let textColor = COLORS.primaryGreen;

  if (status === 'Due') {
    bg = COLORS.errorMuted;
    border = COLORS.errorBorder;
    textColor = COLORS.error;
  } else if (status === 'Ending') {
    bg = COLORS.warningMuted;
    border = COLORS.warningBorder;
    textColor = COLORS.warning;
  } else if (status === 'Completed' || status === 'Locked') {
    bg = COLORS.infoMuted;
    border = COLORS.infoBorder;
    textColor = COLORS.info;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

