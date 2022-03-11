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
    const [end, setEnd] = React.useState();

    React.useEffect(()=>{
      listen("endTime", (args) => {
        console.log("got time as ",args[0]);
        setEnd(args[0]);
        setGameTimer(true);
        setTimer(getTimerText(getTimeLeft(args[0])))
        timerLoop(args[0],setTimer,setGameTimer);
    })},[])

    return (
      <div>
        <h1 style = {cardStyles.timer}>{GameTimer ? timer : ""}</h1>
      </div>
    );
}
const cardStyles = {
    container: {
      flex:1 ,
      marginTop: 8,
      justifyContent: "center",
    },
    timer:{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: '40%',
        position: 'fixed',
        top: '30px',
        color: 'white',
    },
    lobby:{
      color:'white'
    }
  };
  
  
  export default GameTimer;