import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQnxJpj-ng9P7cGXBK9exDYQPEf0pHfXU",
  authDomain: "pteintensivemanagement.firebaseapp.com",
  projectId: "pteintensivemanagement",
  storageBucket: "pteintensivemanagement.appspot.com",
  messagingSenderId: "1098376272599",
  appId: "1:1098376272599:web:e1f0d7e5d3c8f0b0a9a9a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
