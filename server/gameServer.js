//Globals
var io;
var players = {};
var playerdata = {};
var lobby = {};
var keyPress = {};

var state = 0;
var leaderboard = [];
var game = 0;
var loopTimer;

const delay = 10;
const dt = delay * 0.001;
const gameDuration = 20 * 1000; //Seconds * 1000
const lobbyDuration = 5 * 1000; //Seconds * 1000

const MIN_X = -15;
const MAX_X = 15;
const MIN_Z = -15;
const MAX_Z = 15;

const stateMap = [
//State 0 : Lobby State
    {   
        'connect':(socket) => {
            console.log("Player connected during lobby");
            socket.emit("gj");
        },
        'join':(socket,args) => {
            players[socket.id] = {};
            players[socket.id]["name"] = args;
            players[socket.id]["position"] = [0,0,0];
            players[socket.id]["keys"] = [false,false,false,false,false];
            players[socket.id]["score"] = 0;
            players[socket.id]["team"] = 0;

            socket.broadcast.emit("j",[socket.id,args]);
        },
        'keychange':(socket,args) => {
            if (socket.id in players) {
                players[socket.id]["keys"] = args
            }
        },
        'disconnect':(socket,args) => {
            if (socket.id in players) {
                socket.broadcast.emit("l",socket.id);
                delete players[socket.id];
            }
        },
        'update':()=> {
            for (var e in players) {
                e = players[e];
                const normal = (e.keys[0] + e.keys[1] + e.keys[2] + e.keys[3]) > 1 ? 0.707 : 1;
                
                e.position[2] = bound(e.position[2], MIN_Z, MAX_Z);
                e.position[0] = bound(e.position[0], MIN_X, MAX_X);
                e.position[2] += dt * 5 * (e.keys[2] - e.keys[0]) * normal;
                e.position[0] += dt * 5 * (e.keys[3] - e.keys[1]) * normal;
                
            }
            io.emit("u",players);
        },
        'start':()=>{
            for (var socket in lobby){
                io.to(socket).emit("gj");
                delete lobby[socket]
            }
        },
        'end':()=>{

        },
    },

//State 1 : Game State
    {
        'connect':(socket) => {
            console.log("Player connected during game");
            lobby[socket.id] = true;
        },
        'join':(socket,args = undefined) => {
            
        },
        'keychange':(socket,args = undefined) => {
            if (socket.id in players) {
                players[socket.id]["keys"] = args
                if (args[4] == true) {
                    keyPress[socket.id] = true;
                }
            }
        },
        'disconnect':(socket,args = undefined) => {
            //broadcast leave event
            if (socket.id in players) {
                socket.broadcast.emit("l",socket.id);
                delete players[socket.id];
            } else if (socket.id in lobby) {
                delete lobby[socket.id];
            }
        },
        'update':()=> {
            switch(game){
                case 0:
                    game1();
                    break;
                case 1:
                    game2();
                    break;
            }
                
        },
        'start':()=>{
            setTeam = 1;
            let shuffled = shuffle(Object.keys(players));
            for (var e of shuffled) {
                players[e]["team"] = setTeam;
                setTeam = setTeam == 1 ? 2 : 1;
            }
            io.emit("g1u",players);
        },
        'end':()=>{
            let pointsObj = {}
            let teamTotal = 0;
            for (var e in players) {
                teamTotal += players[e]["team"] == 1 ? 1 : -1
            }

            if (teamTotal != 0) {
                teamTotal = teamTotal > 0 ? 1 : 2
            }
            
            for (var e in players) {
                pointsObj[e] = {}
                pointsObj[e]["points"] = players[e]["points"]
                pointsObj[e]["points"] += players[e]["team"] == teamTotal ? 10 : 0
                pointsObj[e]["wins"] += players[e]["team"] == teamTotal ? 1 : 0
                pointsObj[e]["games"] += 1
                players[e]["team"] = 0;
            }

            updateScore(pointsObj, playerdata)

            io.emit("ge",players);
        },
    }
]

//Helpers
function doesCollide(radius, vector1, vector2) {
    //using cylindrical hitbox, check if they are faster
    //using r^2 is much faster than dividing most likely
    let r2 = radius * radius;
    let x = vector1[0] - vector2[0]
    let y = vector1[1] - vector2[1]
    let z = vector1[2] - vector2[2]
    return r2 >= (x*x + y*y + z*z);
}

function bound(value, min, max) {
    return Math.min(Math.max(min,value),max);
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));    
        var t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    return array;
}
//Game

function game1() {
    //Movement
    for (var e in players) {
        e = players[e];
        const normal = (e.keys[0] + e.keys[1] + e.keys[2] + e.keys[3]) > 1 ? 0.707 : 1;
        
        e.position[2] = bound(e.position[2], MIN_Z, MAX_Z);
        e.position[0] = bound(e.position[0], MIN_X, MAX_X);
        e.position[2] += dt * 5 * (e.keys[2] - e.keys[0]) * normal;
        e.position[0] += dt * 5 * (e.keys[3] - e.keys[1]) * normal;
    }

    let didGameUpdate = false;
    for (var presser in keyPress) {
        for (var target in players) {
            if (presser == target) {
                continue;
            }
            if (doesCollide(1,players[presser].position, players[target].position) && (players[presser].team != players[target].team)) {
                players[target].team = players[presser].team;
                players[presser].score += 1
                didGameUpdate = true;
            }
        }
        delete keyPress[presser]
    }

    if (didGameUpdate) {
        io.emit("g1u",players);
        return;  
    }
    io.emit("u",players);
}

function game2() {

}

function gameLoop() {
    stateMap[state].update();
}

function stateSwitchLoop() {
    if (state != 2) {
        console.log("Lobby started");
        stateMap[state].end()
        state = 0;
        stateMap[state].start()
        io.emit("clock",[Date.now(),gameDuration]);
        setTimeout(()=> {
            if (state !=2) {
                console.log("Game Started");
                stateMap[state].end()
                state = 1;
                stateMap[state].start()
                setTimeout(stateSwitchLoop,gameDuration)
                io.emit("clock",[Date.now(),gameDuration]);
            } else {
                state = 0;
            }
        }, lobbyDuration)
    } else {
        state = 0;
    }
}

function startGameLoop() {
    gameLoopTimer = setInterval(gameLoop,delay);
    stateLoopTimer = stateSwitchLoop()
}

//Socket.io
function setIO(newIO) {
    io = newIO;
}

function initSocket(socket) {
    //run console log on connect
    socket.emit('pl',players)
    stateMap[state]['connect'](socket);

    //join event
    socket.on('j', function(args) {
        stateMap[state]['join'](socket, args);
    })

    //key update event for server authoritative calculations
    socket.on('kc', function(args) {
        stateMap[state]['keychange'](socket, args);
    })

    //add event handler to disconnect
    socket.on('disconnect', function() {
        stateMap[state]['disconnect'](socket);
    });
}

//Database methods
function addPlayerData(data, socket) {
    playerdata[socket] = {...data};
}

function updateScore(points, datamapping) {
    console.log("Did not set update score function");
}

function setUpdateFunction(func) {
    updateScore = func;
}

module.exports = {'setIO':setIO,
'startGameLoop':startGameLoop,
'initSocket':initSocket, 
'setUpdateFunction':setUpdateFunction,
'addPlayerData':addPlayerData}