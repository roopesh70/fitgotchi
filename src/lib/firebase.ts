// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "fitgotchi-2o",
  appId: "1:646287788482:web:1a87b3b13fdc112894ee5b",
  storageBucket: "fitgotchi-2o.firebasestorage.app",
  apiKey: "AIzaSyAn-hDpm44NS3JCqCKIVubZPlS6e4xW-QM",
  authDomain: "fitgotchi-2o.firebaseapp.com",
  measurementId: "G-RGKLS51WTW",
  messagingSenderId: "646287788482",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// This ensures the authentication request is explicitly associated with your project's domain.
provider.setCustomParameters({
  authDomain: firebaseConfig.authDomain
});


export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
export type { User };
