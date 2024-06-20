// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIDwwiMglN4CwgVZ5QbpYJenvezeLt_VY",
  authDomain: "mainapp-auth.firebaseapp.com",
  projectId: "mainapp-auth",
  storageBucket: "mainapp-auth.appspot.com",
  messagingSenderId: "1059278588083",
  appId: "1:1059278588083:web:51ee3ec05c1aa51c9688c6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
