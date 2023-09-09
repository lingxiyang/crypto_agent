import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCOZS7X7wRd-fOYJBchcW-ntIgrQ6Xsu28',
  authDomain: 'crypto-agent-e7d42.firebaseapp.com',
  projectId: 'crypto-agent-e7d42',
  storageBucket: 'crypto-agent-e7d42.appspot.com',
  messagingSenderId: '317984318610',
  appId: '1:317984318610:web:5890dd57eb13229ab4f24b',
  measurementId: 'G-206RZEMQP6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
export const analytics = getAnalytics();
