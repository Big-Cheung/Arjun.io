import * as React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import {listen} from './events.js'
import { StylesContext } from '@material-ui/styles';

function getTimeLeft(time){
  const currTime = Date.now();
  const total = time - currTime
  const seconds = Math.floor((total/1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return [total, minutes, seconds];
}

function getTimerText(timeLeft) {
  let [total, minutes, seconds] = timeLeft;
  return (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds);
}

function timerLoop(endTime,func,stopfunc) {
  let times = getTimeLeft(endTime);
  console.log(endTime);
  if (times[0] > 0) {
    func(getTimerText(times));
    setTimeout(() => (timerLoop(endTime,func,stopfunc)),times[0]%1000);
  } else {
    stopfunc(false)
  }
}

const GameTimer = () => {
  const [GameTimer, setGameTimer] = React.useState(false);
  const [timer, setTimer] = React.useState('00:00');
  const [gameState, setGameState] = React.useState(0);
  const [end, setEnd] = React.useState();
  const [winner, setWinner] = React.useState();

  // Timer
  React.useEffect(()=>{
    listen("endTime", (args) => {
      setEnd(args[0]);
      setGameState(args[1]);
      setGameTimer(true);
      setTimer(getTimerText(getTimeLeft(args[0])))
      timerLoop(args[0],setTimer,setGameTimer);
  })}, [])

  // Display Winner
  React.useEffect(()=>{
    listen("gameOver", (e) => {
      if (e === 0) setWinner("Tie Game!")
      else if (e === 1) setWinner("Purple Team Wins!")
      else setWinner("Blue Team Wins!")
      console.log(e);
  })}, [])

  return (
    <div style = {cardStyles.container}>
      <div style = {cardStyles.timer}>{GameTimer ? (timer + " Until Game " + (gameState == 0 ? "Starts!" : "Ends!")) : ""} </div>
      {(gameState === 0) &&
        <div style={{
          color: winner === "Purple Team Wins" ? "purple" : winner === "Blue Team Wins!" ? "blue" : "white",
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Consolas",
        }}>
          {winner}
        </div>
      } 
    </div>
  );
}

const cardStyles = {
    container: {
      position: "fixed",
      margin: "auto",
      left: 0,
      right: 0,
      top: 5,
      width: 700,
    },
    timer:{
      color: 'white',
      textAlign: "center",
      fontSize: 40,
      fontWeight: "bold",
      fontFamily: "Consolas"
    },
    lobby:{
      color:'white'
    }
  };
  
  
  export default GameTimer;