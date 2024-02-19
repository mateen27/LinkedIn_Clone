import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBSyJRUN95uJOBePf71jnSi7w--8yOwrWo",
  authDomain: "linkedin-d0326.firebaseapp.com",
  projectId: "linkedin-d0326",
  storageBucket: "linkedin-d0326.appspot.com",
  messagingSenderId: "596807077462",
  appId: "1:596807077462:web:8d820f51c9ebca3a70b5f7",
  measurementId: "G-X9XBNS20CG"
};

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
if ( !firebase.apps.length ) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase }