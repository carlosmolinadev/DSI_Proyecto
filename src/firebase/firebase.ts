import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCx7aktN6OL2I1KdJ60A581BNSHP1cr7VU",
  authDomain: "sistema-evaluacion.firebaseapp.com",
  projectId: "sistema-evaluacion",
  storageBucket: "sistema-evaluacion.appspot.com",
  messagingSenderId: "47061923989",
  appId: "1:47061923989:web:d2f5ba5fb7a856464bc39c",
  measurementId: "G-0QD9FE0ZRX",
});

// const auth = firebase.auth();
// const storage = firebase.storage();
// const database = firebase.database();

//const db = firebaseApp.firestore();
const db = firebase.firestore();

export { db };
