import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FirebaseAuth from 'firebase/auth';

import { firebaseApp } from './firebaseApp';

const { browserLocalPersistence, initializeAuth } = FirebaseAuth;
type AuthDependencies = NonNullable<Parameters<typeof initializeAuth>[1]>;
const { getReactNativePersistence } = FirebaseAuth as typeof FirebaseAuth & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => AuthDependencies['persistence'];
};

export const auth = initializeAuth(firebaseApp, {
  persistence:
    Platform.OS === 'web'
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});