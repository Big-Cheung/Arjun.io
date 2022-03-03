import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import game from "./game.js"



ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <App/>
  </Suspense>,
  document.getElementById('root')
);
game();

