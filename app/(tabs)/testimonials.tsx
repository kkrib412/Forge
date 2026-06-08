import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView,
  FlatList, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionTag } from '../../components/SectionTag';
import { HexIcon } from '../../components/HexIcon';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width: W } = Dimensions.get('window');
const CARD_W = W - SPACING.lg * 2;

const TESTIMONIALS = [
  {
    name: 'Maria Gonzalez',
    business: 'Maria\'s Bakery & Café',
    quote: 'The AI Forge redesigned our website and set up an online ordering system. Our weekend orders tripled in the first month. I wish I had done this years ago.',
    rating: 5,
    initials: 'MG',
  },
  {
    name: 'James Kowalski',
    business: 'Pittsburgh Auto & Tires',
    quote: 'They optimized our Google listing and now we show up first when people search for tires in Pittsburgh. The chatbot they set up handles appointment booking while we sleep.',
    rating: 5,
    initials: 'JK',
  },
  {
    name: 'Tanya Brown',
    business: 'TBrown\'s Cleaning Services',
    quote: 'I had zero web presence before The AI Forge. Now I have a beautiful website, 50+ Google reviews, and more clients than I can handle. Best investment I\'ve ever made.',
    rating: 5,
    initials: 'TB',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={styles.star}>★</Text>
      ))}
    </View>
  );
}

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
  return (
    <View style={[styles.card, { width: CARD_W }]}>
      <LinearGradient
        colors={[COLORS.bgElevated, COLORS.bgCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardInner}
      >
        {/* Quote mark */}
        <Text style={styles.quoteMark}>"</Text>

        <StarRating count={item.rating} />

        <Text style={styles.quote}>{item.quote}</Text>

        <View style={styles.clientRow}>
          <View style={styles.avatarWrap}>
            <HexIcon size={48} color={COLORS.forge} filled />
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Text style={styles.clientBiz}>{item.business}</Text>
          </View>
        </View>

        {/* Glow accent */}
        <View style={styles.cardGlow} pointerEvents="none" />
      </LinearGradient>
    </View>
  );
}

export default function TestimonialsScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActiveIndex(index);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SectionTag label="Client Results" />
          <Text style={styles.pageTitle}>Real Businesses.{'\n'}Real Results.</Text>
          <Text style={styles.pageSubtitle}>
            Don't take our word for it — hear from the Pittsburgh business owners we've helped.
          </Text>
        </View>

        {/* Carousel */}
        <FlatList
          ref={flatRef}
          data={TESTIMONIALS}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <TestimonialCard item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_W + SPACING.md}
          decelerationRate="fast"
          contentContainerStyle={styles.carousel}
          ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
          onMomentumScrollEnd={handleScroll}
        />

        {/* Pagination dots */}
        <View style={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Stats banner */}
        <View style={styles.statsBanner}>
          {[
            { val: '50+', label: 'Businesses Helped' },
            { val: '4.9★', label: 'Average Rating' },
            { val: '100%', label: 'Local Pittsburgh' },
          ].map((s, i) => (
            <View key={i} style={styles.bannerItem}>
              <Text style={styles.bannerVal}>{s.val}</Text>
              <Text style={styles.bannerLabel}>{s.label}</Text>
            </View>
          ))}
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  pageTitle: {
    fontFamily: FONTS.heading,
    fontSize: 44,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  pageSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  carousel: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.forge,
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 8,
  },
  cardInner: {
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  quoteMark: {
    fontFamily: FONTS.heading,
    fontSize: 80,
    color: COLORS.forge,
    opacity: 0.15,
    position: 'absolute',
    top: -10,
    left: 12,
    lineHeight: 80,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  star: {
    color: COLORS.forge,
    fontSize: 18,
    marginRight: 2,
  },
  quote: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 26,
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    position: 'absolute',
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  clientBiz: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardGlow: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.forge,
    opacity: 0.05,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  dotActive: {
    backgroundColor: COLORS.forge,
    width: 20,
    borderRadius: 3,
  },
  statsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  bannerItem: {
    alignItems: 'center',
  },
  bannerVal: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.forge,
  },
  bannerLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
});
