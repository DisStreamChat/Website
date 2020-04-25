import firebase from "firebase"


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "distwitchchat-db.firebaseapp.com",
    databaseURL: "https://distwitchchat-db.firebaseio.com",
    projectId: "distwitchchat-db",
    storageBucket: "distwitchchat-db.appspot.com",
    messagingSenderId: "559894947762",
    appId: "1:559894947762:web:afbe4455a38d6189eae6ab",
    measurementId: "G-TB4BJR7W7Q"
};

firebase.initializeApp(firebaseConfig)

export default firebase