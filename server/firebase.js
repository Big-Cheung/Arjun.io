import { initializeApp} from 'firebase/app';
import { getDatabase } from "firebase/database";
import 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1U7iVCc3E--AwAcDv6td2AZaM8YyOxNY",
  authDomain: "arjunio.firebaseapp.com",
  databaseURL: "https://arjunio-default-rtdb.firebaseio.com",
  projectId: "arjunio",
  storageBucket: "arjunio.appspot.com",
  messagingSenderId: "1024233461521",
  appId: "1:1024233461521:web:827df22c397ef47e7a9eb0"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig)
const db = getDatabase()
const auth = app.auth()
auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
export {db, auth}
export default fbApp