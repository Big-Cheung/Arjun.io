import React, {useState} from 'react';
import Cookies from 'js-cookie'
import {auth} from './firebase'
import {setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut} from 'firebase/auth';
export default function Login() {
  const [username, setUser] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async e =>{
      e.preventDefault();
      setPersistence(auth, browserSessionPersistence);
      signInWithEmailAndPassword(auth, username, password)
      .then(({user}) => {
        return user.getIdToken().then((idToken)=>{
          return fetch('http://localhost:3001/sessionLogin', {
           method: 'POST',
           headers: {
             Accept: 'application/json',
            'Content-Type': 'application/json',
            'CSRF-Token': Cookies.get("XSRF-TOKEN"),
             Origin: 'http://localhost:3000',
           },
           body: JSON.stringify({idToken}),
         });
        });
      })
      .then(()=>{
        return signOut(auth);
      })
      return false;
  }
  return(
    <div className = "login-wrapper">
    <script src="../styles.css" type="text/babel"></script>
    <h1>Login</h1>
    <form onSubmit = {handleSubmit}>
      <div className = "input-container">
      <label>
        <p>Email</p>
        <input type="email" name = "email" onChange = {e => setUser(e.target.value)} required />
      </label>
      </div>
      <div className = "input-container">
      <label>
        <p>Password</p>
        <input type="password" name = "pass" onChange = {e => setPassword(e.target.value)} required/>
      </label>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    </div>
  )
}
