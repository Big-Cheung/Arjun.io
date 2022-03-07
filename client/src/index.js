import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import game from "./game.js"
import Leaderboard from "./Leaderboard.js"

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <App/>
    <Leaderboard/>
  </Suspense>,
  document.getElementById('root')

);
game();

