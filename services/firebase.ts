import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'project-swish.firebaseapp.com',
  projectId: 'project-swish',
  storageBucket: 'project-swish.appspot.com',
  messagingSenderId: '257625210146',
  appId: '1:257625210146:web:d9139ad67c9ffb0b88797b',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth, onAuthStateChanged };
