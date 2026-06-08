import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface SectionTagProps {
  label: string;
  style?: object;
}

export const SectionTag = memo(({ label, style }: SectionTagProps) => (
  <View style={[styles.container, style]}>
    <View style={styles.line} />
    <Text style={styles.label}>{label}</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: COLORS.forge,
  },
  label: {
    fontFamily: FONTS.bodyMed,
    fontSize: 12,
    color: COLORS.forge,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
