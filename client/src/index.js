import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import game from "./game.js"
import Leaderboard from "./Leaderboard.js"
import TitleScreen from "./title.js"
import GameTimer from './timer.js'
import Login from './login.js'
import GameInfo from './gameInfo.js'

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <Login/>
    <Leaderboard/>
    {/* <TitleScreen/> */}
    <GameTimer/>
    <GameInfo/>
  </Suspense>,
  document.getElementById('root')

);
game();

