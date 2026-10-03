import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from './Logo';
import { colors } from '../theme/colors';

export default function AuthForm({
  mode,
  onSubmit,
  onSwitch,
}: {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isSignup = mode === 'signup';

  const submit = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage('Enter your email address and password.');
      return;
    }

    if (isSignup && password.length < 6) {
      setErrorMessage('Your password must be at least 6 characters.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      await onSubmit(normalizedEmail, password);
    } catch (error) {
      const authError = error as {
        code?: unknown;
        message?: unknown;
      };

      const code =
        typeof authError.code === 'string'
          ? authError.code
          : undefined;

      switch (code) {
        case 'auth/invalid-email':
          setErrorMessage('Enter a valid email address.');
          break;

        case 'auth/email-already-in-use':
          setErrorMessage(
            'An account already exists for this email.'
          );
          break;

        case 'auth/operation-not-allowed':
        case 'auth/admin-restricted-operation':
          setErrorMessage(
            'Email/password sign-in is disabled. Enable it in your Firebase Authentication settings.'
          );
          break;

        case 'auth/configuration-not-found':
          setErrorMessage(
            'Firebase Authentication is not configured for this project yet. Finish setup in the Firebase Console, then enable Email/Password sign-in.'
          );
          break;

        case 'auth/invalid-api-key':
          setErrorMessage(
            'Firebase rejected the API key. Check the Firebase configuration in .env.local.'
          );
          break;

        case 'auth/weak-password':
          setErrorMessage(
            'Choose a stronger password with at least 6 characters.'
          );
          break;

        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setErrorMessage('Email or password is incorrect.');
          break;

        case 'auth/network-request-failed':
          setErrorMessage(
            'Could not connect. Check your internet connection and try again.'
          );
          break;

        default:
          setErrorMessage(
            typeof authError.message === 'string'
              ? `Firebase error${code ? ` (${code})` : ''}: ${authError.message}`
              : `Authentication failed${code ? ` (${code})` : ''}. Please try again.`
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size={40} />
          <Text style={styles.brand}>FocusFlow</Text>
        </View>

        <Text style={styles.title}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrorMessage('');
              }}
              placeholder="Email address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setErrorMessage('');
              }}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!passwordVisible}
              autoComplete={isSignup ? 'new-password' : 'password'}
              style={styles.input}
            />

            <Pressable
              style={styles.passwordToggle}
              onPress={() => setPasswordVisible(!passwordVisible)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible ? 'Hide password' : 'Show password'
              }
            >
              <Ionicons
                name={
                  passwordVisible
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.pressed,
              loading && styles.disabled,
            ]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.submitText}>
                {isSignup ? 'Create account' : 'Login'}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={onSwitch}
          hitSlop={8}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {isSignup
              ? 'Already have an account? '
              : 'Don\'t have an account? '}
            <Text style={styles.switchAction}>
              {isSignup ? 'Login' : 'Sign Up'}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 62,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
  },
  brand: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  form: {
    gap: 17,
    marginTop: 18,
  },
  inputWrapper: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 49,
    paddingHorizontal: 14,
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    marginLeft: 11,
  },
  passwordToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 50,
    justifyContent: 'center',
    marginTop: 1,
  },
  submitText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
  },
  switchAction: {
    color: colors.primary,
    fontWeight: '500',
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
  disabled: {
    opacity: 0.7,
  },
});