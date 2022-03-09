const { initializeApp } = require('firebase/app');
const { getDatabase, onValue, set, ref, update } = require("firebase/database");
const {
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut} = require('firebase/auth');

//This is literally the most janky firebase usage
//you could possibly have. However, it works.
//That is enough for me.


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
const auth = getAuth()
auth.setPersistence('none');

function writeUserData(userId, data) {
  set(ref(db, 'users/' + userId), data);
}

function updateUserData(userId, data) {
  update(ref(db, 'users/' + userId), data);
}

function getUserData(userId) {
  return new Promise((resolve,reject) => {
    onValue(ref(db, 'users/' + userId), (snapshot) => {
      resolve(snapshot.val());
    },{onlyOnce:true});
  })
}

//dictionary key|value
//username|data
function getLeaderboard() {

}


function attemptLogin(email, password) {
  return signInWithEmailAndPassword(auth,email,password)
  .then((cred) => {
    return getUserData(cred.user.uid)
    .then((data) =>{
      signOut(auth)
      return {status:"success",
              user:data.username,
              wins:data.wins,
              points:data.points,
              games:data.games,
              model:data.model,
              uid:cred.user.uid}})
  }).catch((error) =>{
    let res = {}
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      res.msg = 'No accounts with this email and password have been found.';
    }
    console.log(error)
    res.status = "failed"
    return res;
  })
}

function attemptSignup(email, password, username) {
  return createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    //signed in
    const user = userCredential.user;
    writeUserData(user.uid, 
      {username:username,
      points:0,
      wins:0,
      games:0,
      model:0})
    signOut(auth)
    return {status:"success",
            name:username,
            points:0,
            wins:0,
            games:0,
            model:0}
    })
  .catch((error)=> {
    let res = {}
    if (error.code === 'auth/email-already-in-use') {
      res.msg = 'That email address is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      res.msg = 'That email address is invalid.';
    } else if (error.code === 'auth/weak-password') {
      res.msg = 'This password is too weak.'
    }
    res.status = "failed"
    return res;
  })
  
}


module.exports = {
  'attemptLogin':attemptLogin, 
  'attemptSignup':attemptSignup, 
  'getUserData':getUserData, 
  'updateUserData':updateUserData
}