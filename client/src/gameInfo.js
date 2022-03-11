import React, { useState } from 'react';
import './App.css';

function GameInfo() {
    const [isShown, setIsShown] = useState(false);

    return (
        <div className="App">
            <button
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
                style={{ background: "transparent", position: "fixed", bottom: '0px', color: 'white'}}>
                ?
            </button>
            {isShown && (
                <div style={{ position: "fixed", height: '120px',bottom: '20px', left: '10px', background: 'rgb(163, 102, 255)'}}>
                    <h3 style={{position: "fixed", bottom: "95px", left: '20px'}}>Directions:</h3>
                    <ul style={{margin: '32px'}}>
                        <li>Use the 'W' 'A' 'S' 'D' keys to move your model</li>
                        <li>Use 'P' to tag other players on the opposing team</li>
                        <li>Win by tagging all opposing players</li>
                        <li>Good luck!</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GameInfo;