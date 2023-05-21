import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBORxnX5wZfyafI5nszlEYb4dp1zdxE1DE",
    authDomain: "supermarket-61180.firebaseapp.com",
    projectId: "supermarket-61180",
    storageBucket: "supermarket-61180.appspot.com",
    messagingSenderId: "791568565376",
    appId: "1:791568565376:web:9c87159503b41b013a9265",
    measurementId: "G-YM5MRL83D0"
};

firebase.initializeApp(firebaseConfig);



export default firebase;
