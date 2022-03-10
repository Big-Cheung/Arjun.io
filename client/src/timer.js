import * as React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import {listen} from './events.js'
import { StylesContext } from '@material-ui/styles';

const GameTimer = () => {
    const [GameTimer, setGameTimer] = React.useState(false);
    const [timer, setTimer] = React.useState('00:00');
    const [end, setEnd] = React.useState();
    const Ref = React.useRef(null);
    React.useEffect(()=>{
      listen("endTime", (args) => {
        console.log("time = ",args[0]);
        setEnd(args[0]);
        console.log("game state = ",args[1]);
        setGameTimer(args[1]);
      })},[])
    function getTimeLeft(time){
        const currTime = Date.now();
        const total = time - currTime
        const seconds = Math.floor((total/1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }
    function startTimer(time) {
        let {total, minutes, seconds} = getTimeLeft(time);
        setTimer(
            (minutes > 9 ? minutes : '0' + minutes) + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
        console.log(timer)
    }
    if (Ref.current) 
    clearInterval(Ref.current);
    const id = setInterval(() => {
    startTimer(end);
    }, 1000)
    Ref.current = id;
    
    if (GameTimer === 1)
    {
    if (timer === '00:00')
    {
      return null
    }
    else{
    return (
      <div>
        <h1 style = {cardStyles.timer}> {timer}</h1>
      </div>
    );
    }
  }
  
  else
  {
    return (
        <div>
        </div>
      );
      
  }
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