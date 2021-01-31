import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDmZnwUJ453QJgTt2m8muCR1WJKQ1mA0nA",
    authDomain: "unfairpong.firebaseapp.com",
    projectId: "unfairpong",
    storageBucket: "unfairpong.appspot.com",
    messagingSenderId: "1064261218221",
    appId: "1:1064261218221:web:4eab086e6825a545c7fb24",
    measurementId: "G-HCVZYHX7JZ"
});

const db = firebaseApp.firestore();
firebase.analytics();

export { db };