import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Svg, { Line, Circle, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionTag } from '../../components/SectionTag';
import { HexIcon } from '../../components/HexIcon';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

const STEPS = [
  {
    num: '01',
    title: 'Free Audit',
    desc: 'We analyze your current digital presence — website, SEO, social media, and listings — and identify exactly where you\'re losing customers.',
    icon: '🔍',
  },
  {
    num: '02',
    title: 'Build & Upgrade',
    desc: 'Our team executes the strategy: redesigning your site, setting up AI tools, optimizing your Google presence, and building the systems your business needs.',
    icon: '⚙️',
  },
  {
    num: '03',
    title: 'Launch & Grow',
    desc: 'Go live with confidence. We monitor performance, fine-tune your setup, and keep your digital presence working hard so you don\'t have to.',
    icon: '🚀',
  },
];

function PulsingHex({ delay = 0 }: { delay?: number }) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    glow.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0.4, { duration: 900 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: glow.value,
  }));

  return (
    <Animated.View style={[styles.hexGlow, style]}>
      <HexIcon size={64} color={COLORS.forge} glowing />
    </Animated.View>
  );
}

export default function ProcessScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionTag label="How It Works" style={styles.sectionTag} />
        <Text style={styles.pageTitle}>Three Steps to{'\n'}Digital Dominance</Text>
        <Text style={styles.pageSubtitle}>No fluff. No contracts. Just results.</Text>

        <View style={styles.timeline}>
          {/* Vertical connecting line */}
          <View style={styles.timelineLine} />

          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              {/* Node */}
              <View style={styles.nodeCol}>
                <View style={styles.nodeWrap}>
                  <PulsingHex delay={i * 600} />
                  <View style={styles.nodeInner}>
                    <Text style={styles.nodeNum}>{step.num}</Text>
                  </View>
                </View>
              </View>

              {/* Content */}
              <View style={styles.stepContent}>
                <Text style={styles.stepEmoji}>{step.icon}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={[COLORS.forge + '15', COLORS.bgCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bottomCta}
        >
          <Text style={styles.bottomCtaTitle}>Ready to start?</Text>
          <Text style={styles.bottomCtaText}>
            The whole process starts with a free, no-pressure audit call. No commitment required.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
  },
  sectionTag: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  pageTitle: {
    fontFamily: FONTS.heading,
    fontSize: 44,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  pageSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 80,
  },
  timelineLine: {
    position: 'absolute',
    left: 32,
    top: 30,
    bottom: 30,
    width: 2,
    backgroundColor: COLORS.forge + '30',
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
    alignItems: 'flex-start',
  },
  nodeCol: {
    position: 'absolute',
    left: -80,
    top: 0,
    width: 80,
    alignItems: 'center',
  },
  nodeWrap: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexGlow: {
    position: 'absolute',
  },
  nodeInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNum: {
    fontFamily: FONTS.headingMed,
    fontSize: 16,
    color: COLORS.forge,
    letterSpacing: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepEmoji: {
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  stepTitle: {
    fontFamily: FONTS.headingMed,
    fontSize: 26,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  stepDesc: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bottomCta: {
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomCtaTitle: {
    fontFamily: FONTS.headingMed,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bottomCtaText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },
});
