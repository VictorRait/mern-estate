// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-estate-ef6f1.firebaseapp.com",
	projectId: "mern-estate-ef6f1",
	storageBucket: "mern-estate-ef6f1.appspot.com",
	messagingSenderId: "371404435018",
	appId: "1:371404435018:web:14e45cdb9c67fb8445c0b3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
