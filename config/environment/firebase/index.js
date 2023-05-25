import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhu6DmFchGlV-i0OOG0rLs6YbCBbqjkI4",
  authDomain: "ternium-talent.firebaseapp.com",
  projectId: "ternium-talent",
  storageBucket: "ternium-talent.appspot.com",
  messagingSenderId: "435801084806",
  appId: "1:435801084806:web:59bd60e9a514a6720a1207",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
