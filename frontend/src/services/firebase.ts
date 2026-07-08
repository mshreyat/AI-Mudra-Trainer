// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBa2zlV3Fn5r65wTR_QhHDLufogcSzP0Iw",
    authDomain: "mudrasense-ai.firebaseapp.com",
    projectId: "mudrasense-ai",
    storageBucket: "mudrasense-ai.firebasestorage.app",
    messagingSenderId: "33947226998",
    appId: "1:33947226998:web:fd47dc0dca0fd9845fe057"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);