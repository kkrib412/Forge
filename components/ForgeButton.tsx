import React, { useCallback } from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const HAPTIC_OK = Platform.OS !== 'web';

interface ForgeButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ForgeButton({
  label,
  onPress,
  variant = 'primary',
  style,
  labelStyle,
  disabled = false,
}: ForgeButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    if (HAPTIC_OK) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  }, []);

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={[COLORS.forgeLight, COLORS.forge, COLORS.forgeDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonInner}
        >
          <Text style={[styles.labelPrimary, labelStyle]}>{label}</Text>
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  if (variant === 'outline') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.outlineButton, animatedStyle, style]}
      >
        <Text style={[styles.labelOutline, labelStyle]}>{label}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.secondaryButton, animatedStyle, style]}
    >
      <Text style={[styles.labelSecondary, labelStyle]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonInner: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.forge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.steel + '20',
    borderWidth: 1,
    borderColor: COLORS.steel + '60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelPrimary: {
    fontFamily: FONTS.headingMed,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  labelOutline: {
    fontFamily: FONTS.headingMed,
    fontSize: 16,
    color: COLORS.forge,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  labelSecondary: {
    fontFamily: FONTS.headingMed,
    fontSize: 16,
    color: COLORS.steel,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
