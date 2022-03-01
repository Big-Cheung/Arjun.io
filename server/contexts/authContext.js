import React, {useContext, useState, useEffect} from 'react'
import {auth} from '../firebase.js'
import { getDatabase, ref, set } from "firebase/database";

const authContext = React.createContext()

function writeUserData(userId, name, email) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
  });
}

export function useAuth(){
  return useContext(authContext)
}

export function authProvider( { children } ) {
  const [currentUser, setCurrentUser] = useState()
  const [loading,setLoading] = useState(true)
  function signup(username, email, password)
    {
   return (auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        writeUserData(user.uid, username, email)
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
      }))
    }
  function login(email, password)
    {
      return auth.signInWithEmailAndPassword(email,password)
    }

  function logout() {
    return auth.signout()
  }
  
  useEffect(()=>{
  const unsubscribe =  auth.onAuthStateChanged(user => {
    setCurrentUser(user)
    setLoading(false)
  })
    return unsubscribe
  }, [])
  const value = { 
    currentUser,
    signup,
    login,
    logout
    }
  return (
    <authContext.Provider value = {value}>
      {!loading && children}
    </authContext.Provider>
  )
}