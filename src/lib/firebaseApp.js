// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMOZ0K0ligtxUSaZDhZboW-eREUHob4EY",
  authDomain: "my-temantanam-dev.firebaseapp.com",
  projectId: "my-temantanam-dev",
  storageBucket: "my-temantanam-dev.appspot.com",
  messagingSenderId: "430153960383",
  appId: "1:430153960383:web:bffd3feacbbda72723af0a"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

module.exports = firebaseApp;