import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import reportWebVitals from './reportWebVitals';
import game from "./game.js"



ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <App/>
  </Suspense>,
  document.getElementById('root')
);
game();





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
