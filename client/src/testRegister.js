import React, {useState} from 'react';
//import Cookies from 'js-cookie'
import {auth, db} from './firebase'
import {ref, set } from "firebase/database";
import {createUserWithEmailAndPassword, signOut} from 'firebase/auth';

function writeUserData(userId, name, email) {
  set(ref(db, 'players/' + userId), {
    username: name,
    email: email,
  });
}

export default function Register() {
  const [username, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async e =>{
      e.preventDefault();
      createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        writeUserData(user.uid, username, email)
        console.log("User Created!")
      })
      .catch((error)=> {
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
      
          console.error(error);
          return false;
      })
      .then(()=>{
        return signOut(auth);
      })
      return false;
  }
return(
  <div className = "register-wrapper">
  <script src="../styles.css" type="text/babel"></script>
      <form onSubmit={handleSubmit} class="form" id="login">
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" onChange = {e => setUser(e.target.value)}required />
        </div>
        <div className="input-container">
          <label>Email </label>
          <input type="email" name="email"onChange = {e => setEmail(e.target.value)} required />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" onChange = {e => setPassword(e.target.value)} required />
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
)
}