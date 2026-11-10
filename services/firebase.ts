import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'project-swish.firebaseapp.com',
  projectId: 'project-swish',
  storageBucket: 'project-swish.appspot.com',
  messagingSenderId: '257625210146',
  appId: '1:257625210146:web:d9139ad67c9ffb0b88797b',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };