import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  storageBucket: `${projectId}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const ai = getAI(app, { backend: new GoogleAIBackend() });
const gemini = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are an AI agent that generates input for a car bingo game. You do what the request is and do not add clarifications. Your responses are always in Swedish.",
});

export { app, gemini };
