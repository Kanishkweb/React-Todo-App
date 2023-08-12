import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDC_b4OAzFRXQmgwPSlNn6IsEGcsnEGqCI",
  authDomain: "react-todo-app-cd381.firebaseapp.com",
  projectId: "react-todo-app-cd381",
  storageBucket: "react-todo-app-cd381.appspot.com",
  messagingSenderId: "296320792469",
  appId: "1:296320792469:web:f14c0f95108ee193c6289c",
  measurementId: "G-LFG6CZJKCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 
console.log(db)
const storage = getStorage(app);
export { auth , provider,storage, db} 
export default db;