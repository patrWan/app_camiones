import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCybTK1kaKZtP99G0K8o0IMWgL-vBylbuQ",
    authDomain: "trudistics.firebaseapp.com",
    projectId: "trudistics",
    storageBucket: "trudistics.appspot.com",
    messagingSenderId: "228483098144",
    appId: "1:228483098144:web:a4d59c637b6bc26ce9fe45"
  };

  const fb = firebase.initializeApp(firebaseConfig);
  export const fire = firebase;
  export const db = fb.firestore();
  export const storage = fb.storage();
  export const auth = fb.auth();