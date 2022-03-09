import * as React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

const GameTimer = () => {
    const [GameTimer, setGameTimer] = React.useState(false);
    const [timer, setTimer] = React.useState('00:00');
    const Ref = React.useRef(null);
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
    }
    if (Ref.current) 
        clearInterval(Ref.current);
    const id = setInterval(() => {
        startTimer(1646848575316);
    }, 1000)
    Ref.current = id;
    
    if (GameTimer)
    {
    
    return (
      <div>
          <h2>{timer}</h2>
      </div>
    );
  }
  else
  {
    return (
        <div>
          <h1 style={cardStyles.timer}>{timer} </h1>
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
        paddingLeft: '500px',
    }
  };
  
  
  export default GameTimer;