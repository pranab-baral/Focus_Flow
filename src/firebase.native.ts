import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FirebaseAuth from 'firebase/auth';
import { initializeAuth } from 'firebase/auth';
import { firebaseApp } from './firebaseApp';

type AuthDependencies = NonNullable<Parameters<typeof initializeAuth>[1]>;
const { getReactNativePersistence } = FirebaseAuth as typeof FirebaseAuth & {
	getReactNativePersistence: (storage: typeof AsyncStorage) => AuthDependencies['persistence'];
};

export const auth = initializeAuth(firebaseApp, {
	persistence: getReactNativePersistence(AsyncStorage),
});