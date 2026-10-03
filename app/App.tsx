import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './Home';
import LoginScreen from './login';
import SignupScreen from './signup';
import OnboardingScreen from './Onboarding';
import { auth } from '../src/firebase';
import { colors } from '../src/theme/colors';

const ONBOARDING_KEY = 'focusflow:onboarding-complete';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>(
    'login'
  );
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (signedInUser) => {
      setUser(signedInUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(value === 'true');
      } catch {
        setHasSeenOnboarding(false);
      } finally {
        setOnboardingReady(true);
      }
    };

    loadOnboarding();
  }, []);

  if (!authReady || !onboardingReady) {
    return (
      <View style={styles.loading}>
        <StatusBar style="dark" />
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (user) {
    return (
      <HomeScreen
        uid={user.uid}
        email={user.email ?? ''}
        onLogout={() => signOut(auth)}
      />
    );
  }

  if (!hasSeenOnboarding) {
    const finishOnboarding = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      } catch {
        // Continue even if storage fails.
      }

      setHasSeenOnboarding(true);
    };

    return <OnboardingScreen onContinue={finishOnboarding} />;
  }

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignUp = async (
    email: string,
    password: string
  ) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  if (authScreen === 'signup') {
    return (
      <SignupScreen
        onSignUp={handleSignUp}
        onLogin={() => setAuthScreen('login')}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onSignUp={() => setAuthScreen('signup')}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
});