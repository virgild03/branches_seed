
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCdFdDWSmGoEjeBXsIMXvMdnyXX7kyjIO8",
  authDomain: "seed-ebd4b.firebaseapp.com",
  projectId: "seed-ebd4b",
  storageBucket: "seed-ebd4b.firebasestorage.app",
  messagingSenderId: "467048315729",
  appId: "1:467048315729:web:4dc726ed83ab5a38a9f170",
  measurementId: "G-LPH194TDTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
//const analytics = getAnalytics(app);

