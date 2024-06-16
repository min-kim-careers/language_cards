import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'project-swish.firebaseapp.com',
  projectId: 'project-swish',
  storageBucket: 'project-swish.appspot.com',
  messagingSenderId: '257625210146',
  appId: '1:257625210146:web:d9139ad67c9ffb0b88797b',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// getAuth() can be used any time after initialization
