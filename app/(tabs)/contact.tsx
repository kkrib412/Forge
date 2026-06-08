import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Platform,
  Linking, TouchableOpacity, Alert, KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SectionTag } from '../../components/SectionTag';
import { ForgeButton } from '../../components/ForgeButton';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const SERVICES = [
  'Website Upgrade / Redesign',
  'Online Presence & Local SEO',
  'AI Setup & Automation',
  'Brand-New Website Build',
  'Not Sure — Let\'s Talk',
];

interface FormField {
  label: string;
  key: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

const FIELDS: FormField[] = [
  { label: 'Your Name', key: 'name', placeholder: 'John Smith' },
  { label: 'Business Name', key: 'business', placeholder: 'Smith\'s Hardware Co.' },
  { label: 'Email Address', key: 'email', placeholder: 'john@smithshardware.com', keyboardType: 'email-address' },
  { label: 'Phone Number', key: 'phone', placeholder: '(412) 555-0100', keyboardType: 'phone-pad' },
  { label: 'Message', key: 'message', placeholder: 'Tell us a bit about your business and what you\'re looking for...', multiline: true },
];

function ForgeInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(232, 99, 26, ${0.3 + borderAnim.value * 0.7})`,
    shadowOpacity: borderAnim.value * 0.3,
  }));

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <Animated.View style={[styles.inputContainer, animStyle]}>
        <TextInput
          style={[styles.input, field.multiline && styles.inputMulti]}
          value={value}
          onChangeText={onChange}
          placeholder={field.placeholder}
          placeholderTextColor={COLORS.textMuted}
          multiline={field.multiline}
          numberOfLines={field.multiline ? 4 : 1}
          keyboardType={field.keyboardType || 'default'}
          autoCapitalize="words"
          returnKeyType={field.multiline ? 'default' : 'next'}
          onFocus={() => {
            setFocused(true);
            borderAnim.value = withTiming(1, { duration: 200 });
          }}
          onBlur={() => {
            setFocused(false);
            borderAnim.value = withTiming(0, { duration: 200 });
          }}
        />
      </Animated.View>
    </View>
  );
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Record<string, string>>({
    name: '', business: '', email: '', phone: '', message: '',
  });
  const [selectedService, setSelectedService] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const checkScale = useSharedValue(0);

  const setField = useCallback((key: string) => (val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.email) {
      Alert.alert('Hold on!', 'Please fill in your name and email.');
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Build mailto link
    const subject = encodeURIComponent(`AI Forge Audit Request — ${form.business || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nBusiness: ${form.business}\nPhone: ${form.phone}\nService: ${selectedService}\n\n${form.message}`
    );
    const mailto = `mailto:theaiforgepgh@gmail.com?subject=${subject}&body=${body}`;
    await Linking.openURL(mailto);

    setSubmitted(true);
    checkScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
  }, [form, selectedService]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <SectionTag label="Get Started" style={styles.sectionTag} />
          <Text style={styles.pageTitle}>Ready to Forge{'\n'}Your Future?</Text>
          <Text style={styles.pageSubtitle}>
            No pressure. No commitment. Just a free conversation about how we can help.
          </Text>

          {submitted ? (
            <View style={styles.successBox}>
              <Animated.Text style={[styles.successCheck, checkStyle]}>✅</Animated.Text>
              <Text style={styles.successTitle}>Message Sent!</Text>
              <Text style={styles.successText}>
                Your email app should have opened with your message. We'll be in touch within 24 hours!
              </Text>
            </View>
          ) : (
            <>
              {/* Form Fields */}
              {FIELDS.map(field => (
                <ForgeInput
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  onChange={setField(field.key)}
                />
              ))}

              {/* Service Picker */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Service Interested In</Text>
                <View style={styles.serviceGrid}>
                  {SERVICES.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.serviceChip,
                        selectedService === s && styles.serviceChipActive,
                      ]}
                      onPress={() => {
                        setSelectedService(s);
                        if (Platform.OS !== 'web') Haptics.selectionAsync();
                      }}
                    >
                      <Text
                        style={[
                          styles.serviceChipText,
                          selectedService === s && styles.serviceChipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <ForgeButton
                label="Send My Free Audit Request"
                variant="primary"
                onPress={handleSubmit}
                style={styles.submitBtn}
              />

              {/* Direct email link */}
              <TouchableOpacity
                style={styles.emailLink}
                onPress={() => Linking.openURL('mailto:theaiforgepgh@gmail.com')}
              >
                <Text style={styles.emailLinkText}>
                  Or email us directly:{' '}
                  <Text style={{ color: COLORS.forge, textDecorationLine: 'underline' }}>
                    theaiforgepgh@gmail.com
                  </Text>
                </Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                No pressure. No commitment. Just a free conversation.
              </Text>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 60,
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
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  fieldWrap: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgElevated,
    shadowColor: COLORS.forge,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  inputMulti: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  serviceChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgElevated,
  },
  serviceChipActive: {
    borderColor: COLORS.forge,
    backgroundColor: COLORS.forge + '20',
  },
  serviceChipText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  serviceChipTextActive: {
    color: COLORS.forge,
    fontFamily: FONTS.bodySemi,
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
  emailLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  emailLinkText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  disclaimer: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  successCheck: {
    fontSize: 64,
  },
  successTitle: {
    fontFamily: FONTS.headingMed,
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  successText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
