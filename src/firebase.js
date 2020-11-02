import app from "firebase/app"
import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import "firebase/performance"


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

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        app.analytics();
        this.auth = app.auth();
        this.db = app.firestore();
        this.app = app
        this.perf = app.performance()
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    async loginWithGoogle() {
        const provider = app.auth.GoogleAuthProvider()
        const result = await this.auth.signInWithPopup(provider)
        const name = result.user.displayName
        this.auth.currentUser.updateProfile({
            displayName: name
        })
        return result
    }

    get documentId() {
        return app.firestore.FieldPath.documentId()
    }

    logout() {
        return this.auth.signOut()
    }

    async register(name, email, password) {
        await this.auth.createUserWithEmailAndPassword(email, password);
        this.auth.currentUser.updateProfile({
            displayName: name
        })
        return this.auth.currentUser
    }

    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        })
    }

    getCurrentUsername() {
        return this.auth.currentUser.displayName
    }

    delete(){
        return this.app.firestore.FieldValue.delete()
    }
}


export default new Firebase()