// import firebase from "firebase/app";
// import "firebase/auth";

import "firebase/compat/auth"; //v9
import "firebase/compat/firestore"; //v9
import firebase from "firebase/compat/app"; //v9

// var firebaseConfig = {
//   apiKey: "AIzaSyBIBLXJDidymmQXqorr4r3sCmJ2ldwRZ1Y",
//     authDomain: "kharimandi-c2b8e.firebaseapp.com",
//     databaseURL: "https://kharimandi-c2b8e-default-rtdb.firebaseio.com",
//     projectId: "kharimandi-c2b8e",
//     storageBucket: "kharimandi-c2b8e.appspot.com",
//     messagingSenderId: "1006768388220",
//     appId: "1:1006768388220:web:f56cddac551f0288bef1f9"
// };

var firebaseConfig = {
  apiKey: "AIzaSyAawp5UPevH1ZhTnOXosBlz8zaa19OJB9g",
  authDomain: "adityasharma-584d9.firebaseapp.com",
  databaseURL: "https://adityasharma-584d9-default-rtdb.firebaseio.com",
  projectId: "adityasharma-584d9",
  storageBucket: "adityasharma-584d9.appspot.com",
  messagingSenderId: "822304710499",
  appId: "1:822304710499:web:50a6b07160c1047a8e3d56"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;