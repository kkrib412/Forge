import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface EmberParticleProps {
  x: number;
  delay?: number;
  size?: number;
  duration?: number;
}

export function EmberParticle({ x, delay = 0, size = 4, duration = 3000 }: EmberParticleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 40;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-220, { duration, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 300 }),
          withTiming(0.6, { duration: duration - 600 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(drift, { duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 100 }),
          withTiming(0.4, { duration: duration - 100, easing: Easing.out(Easing.quad) })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const emberColor = Math.random() > 0.5 ? COLORS.forge : COLORS.forgeLight;

  return (
    <Animated.View
      style={[
        styles.ember,
        {
          left: x,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: emberColor,
          shadowColor: COLORS.forge,
          shadowRadius: size * 2,
          shadowOpacity: 0.8,
        },
        animStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ember: {
    position: 'absolute',
    bottom: 0,
    elevation: 2,
  },
});
