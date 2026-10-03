import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../src/components/Logo';
import { colors } from '../src/theme/colors';

export default function Onboarding({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        <View style={styles.content}>
          <View style={styles.brand}>
            <Logo size={34} />
            <Text style={styles.brandName}>FocusFlow</Text>
          </View>

          <View style={styles.intro}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="leaf-outline"
                size={25}
                color={colors.primary}
              />
            </View>

            <Text style={styles.eyebrow}>A CALMER WAY TO WORK</Text>

            <Text style={styles.title}>
              Make space for focus.
            </Text>

            <Text style={styles.description}>
              Find your rhythm with soundscapes designed to help
              you settle in and stay present.
            </Text>
          </View>

          <View style={styles.footer}>
            <View
              style={styles.pageIndicator}
              accessibilityLabel="Page 1 of 1"
            >
              <View style={styles.activeDot} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={onContinue}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Get started</Text>
              <Ionicons
                name="arrow-forward"
                size={19}
                color={colors.surface}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 24,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  intro: {
    marginTop: 'auto',
    marginBottom: 54,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 29,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 38,
    lineHeight: 45,
    fontWeight: '700',
    marginTop: 12,
    maxWidth: 330,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 330,
  },
  footer: {
    gap: 24,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeDot: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  button: {
    minHeight: 56,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});