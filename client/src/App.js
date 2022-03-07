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
    <div className="wrapper">
    <h1>Application</h1>
    <BrowserRouter>
      <Routes>
        <Route path="./testProfile.js">
          <Profile />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  ) 
}
