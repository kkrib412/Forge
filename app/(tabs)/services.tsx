import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionTag } from '../../components/SectionTag';
import { HexIcon } from '../../components/HexIcon';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

const SERVICES = [
  {
    emoji: '🌐',
    title: 'Website Upgrades & Redesigns',
    desc: 'Transform outdated sites into modern, high-converting digital storefronts. Fast, mobile-first, and built to impress.',
    featured: false,
    color: COLORS.steel,
  },
  {
    emoji: '📍',
    title: 'Online Presence & Local SEO',
    desc: 'Dominate Google search results in your area. Get found by the customers who are already looking for you.',
    featured: false,
    color: COLORS.steelDark,
  },
  {
    emoji: '🤖',
    title: 'Local AI Setup & Automation',
    desc: 'Chatbots, booking systems, and smart automations that run your business around the clock — even while you sleep.',
    featured: true,
    color: COLORS.forge,
  },
  {
    emoji: '🏗️',
    title: 'Brand-New Website Builds',
    desc: 'No website? No problem. We build professional, SEO-ready websites from scratch for businesses starting fresh.',
    featured: false,
    color: COLORS.steel,
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  useEffect(() => {
    opacity.value = withDelay(
      index * 150,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      index * 150,
      withSpring(0, { damping: 16, stiffness: 120 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animStyle]}>
      <LinearGradient
        colors={
          service.featured
            ? [COLORS.forge + '18', COLORS.bgCard]
            : [COLORS.bgElevated + '80', COLORS.bgCard]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          service.featured && styles.cardFeatured,
        ]}
      >
        {service.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>⚡ MOST POPULAR</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.hexWrap}>
            <HexIcon size={52} color={service.color} glowing={service.featured} />
            <Text style={styles.emoji}>{service.emoji}</Text>
          </View>
        </View>

        <Text style={[styles.cardTitle, service.featured && { color: COLORS.forge }]}>
          {service.title}
        </Text>
        <Text style={styles.cardDesc}>{service.desc}</Text>

        {service.featured && (
          <View style={styles.forgeGlow} pointerEvents="none" />
        )}
      </LinearGradient>
    </Animated.View>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionTag label="What We Do" style={styles.sectionTag} />
        <Text style={styles.pageTitle}>Our Services</Text>
        <Text style={styles.pageSubtitle}>
          Everything your business needs to dominate the digital landscape.
        </Text>

        <View style={styles.grid}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </View>

        <View style={styles.cta}>
          <LinearGradient
            colors={[COLORS.forge + '20', COLORS.bgCard]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBox}
          >
            <Text style={styles.ctaTitle}>Not Sure Which Service?</Text>
            <Text style={styles.ctaText}>
              Book a free 30-minute consultation. We'll assess your business and recommend exactly what you need.
            </Text>
          </LinearGradient>
        </View>
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
    fontSize: 48,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  pageSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  grid: {
    gap: SPACING.md,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },
  cardFeatured: {
    borderColor: COLORS.forge + '60',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.forge,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  featuredBadgeText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  hexWrap: {
    position: 'relative',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    position: 'absolute',
    fontSize: 22,
  },
  cardTitle: {
    fontFamily: FONTS.headingMed,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },
  forgeGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.forge,
    opacity: 0.06,
  },
  cta: {
    marginTop: SPACING.xl,
  },
  ctaBox: {
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaTitle: {
    fontFamily: FONTS.headingMed,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  ctaText: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 23,
  },
});
