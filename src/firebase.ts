import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-RdHmzHQ4wt8gukC4ozbnCTOAMLWCZDU",
  authDomain: "seller-game.firebaseapp.com",
  projectId: "seller-game",
  storageBucket: "seller-game.firebasestorage.app",
  messagingSenderId: "782417773232",
  appId: "1:782417773232:web:f73b4b31a1a1463731b175",
  measurementId: "G-YNM90Z87GP",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);