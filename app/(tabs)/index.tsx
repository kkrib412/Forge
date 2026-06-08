import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { EmberParticle } from '../../components/EmberParticle';
import { ForgeButton } from '../../components/ForgeButton';
import { SectionTag } from '../../components/SectionTag';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width: W, height: H } = Dimensions.get('window');
const NUM_EMBERS = 18;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Ember positions (stable references)
  const embers = useMemo(() =>
    Array.from({ length: NUM_EMBERS }).map(() => ({
      x: Math.random() * W,
      delay: Math.random() * 2500,
      size: 3 + Math.random() * 4,
      duration: 2200 + Math.random() * 1800,
    })), []
  );

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800 }),
        withTiming(1, { duration: 1800 })
      ),
      -1,
      false
    );
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroParallax = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 300],
          [0, -80],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.15], [0.2, 0.05]),
  }));

  return (
    <View style={styles.container}>
      {/* Ember Particle System */}
      <View style={styles.emberContainer} pointerEvents="none">
        {embers.map((e, i) => (
          <EmberParticle key={i} x={e.x} delay={e.delay} size={e.size} duration={e.duration} />
        ))}
      </View>

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.hero, heroParallax, { paddingTop: insets.top + 40 }]}>
          {/* Pulse radial glow */}
          <Animated.View style={[styles.radialGlow, pulseStyle]} pointerEvents="none" />

          <SectionTag label="Pittsburgh's AI Agency" style={styles.sectionTag} />

          <Text style={styles.headline}>
            Your Business.{'\n'}
            <Text style={styles.headlineAccent}>Forged</Text> for the{'\n'}Digital Age.
          </Text>

          <Text style={styles.subheadline}>
            We help local small businesses level up their digital presence using the power of AI —
            from stunning websites to smart automations that work 24/7.
          </Text>

          <View style={styles.ctaRow}>
            <ForgeButton
              label="Free Audit"
              variant="primary"
              onPress={() => router.push('/contact')}
              style={styles.ctaBtn}
            />
            <ForgeButton
              label="Our Services"
              variant="outline"
              onPress={() => router.push('/services')}
              style={styles.ctaBtn}
            />
          </View>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['transparent', COLORS.forge + '10', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.statsGradient}
          />
          {[
            { num: '100%', label: 'Local Focus' },
            { num: 'AI', label: 'Powered Tools' },
            { num: '48h', label: 'Turnaround' },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* About Snippet */}
        <View style={styles.aboutSection}>
          <SectionTag label="About The AI Forge" />
          <Text style={styles.aboutText}>
            We're not a faceless agency. We're your Pittsburgh neighbors — combining
            craft, technology, and hustle to give small businesses the digital tools
            that used to be reserved for corporations.
          </Text>

          <ForgeButton
            label="How It Works →"
            variant="secondary"
            onPress={() => router.push('/process')}
            style={{ alignSelf: 'flex-start', marginTop: SPACING.lg }}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  emberContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.04,
    zIndex: 0,
  },
  hero: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    zIndex: 1,
  },
  sectionTag: {
    marginBottom: SPACING.lg,
  },
  radialGlow: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    backgroundColor: COLORS.forge,
  },
  headline: {
    fontFamily: FONTS.heading,
    fontSize: 58,
    lineHeight: 60,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: SPACING.lg,
  },
  headlineAccent: {
    color: COLORS.forge,
  },
  subheadline: {
    fontFamily: FONTS.body,
    fontSize: 17,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: SPACING.xl,
    maxWidth: '90%',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  ctaBtn: {
    flex: 1,
    minWidth: 140,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  statsGradient: {
    ...StyleSheet.absoluteFill,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: COLORS.forge,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  aboutSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  aboutText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginTop: SPACING.md,
  },
});
