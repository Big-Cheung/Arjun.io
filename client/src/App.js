import React, {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './testLogin.js';
import Profile from './testProfile.js'
import Register from './testRegister.js'
import {getCookie} from './firebase'
export default function GameView() {
  let token = getCookie("sessionID")
  if(token == null) {
    return (
    <div>
    <Login/>
    <Register/>
    </div>
    )
  }
  return (
    <div style={{color:"red"}}>
    This is a test!
    <button onClick={()=> {
      return fetch('http://localhost:3001/sessionLogout')
    }}>
      Logout
    </button>
    </div>
  ) 
}
