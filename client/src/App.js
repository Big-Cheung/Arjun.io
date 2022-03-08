import React, {useState} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './testLogin.js';
import Profile from './testProfile.js'
export default function GameView() {
  const[token, setToken] = useState();
  if(!token) {
    return <Login setToken = {setToken}/>
  }
  return (
    <div style={{color:"red"}}>
    This is a test!
    </div>
  ) 
}
