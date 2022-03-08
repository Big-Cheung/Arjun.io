//Globals
var io;
var players = {};
var lobby = {};
var state = 0;
var leaderboard = [];
var game = 0;
var loopTimer;

const delay = 10;
const dt = delay * 0.001;

const gameDuration = 20 * 1000; //Seconds * 1000
const lobbyDuration = 5 * 1000; //Seconds * 1000

const MIN_X = -15
const MAX_X = 15
const MIN_Z = -15
const MAX_Z = 15



const stateMap = [
//State 0
    {   
        'connect':(socket) => {
            io.to(socket).emit("gj");
        },
        'join':(socket,args) => {
            players[socket.id] = {};
            players[socket.id]["name"] = args;
            players[socket.id]["position"] = [0,0,0];
            players[socket.id]["keys"] = [false,false,false,false];
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

//State 1 Game
    {
        'connect':(socket) => {
            lobby[socket.id] = true;
        },
        'join':(socket,args = undefined) => {
            
        },
        'keychange':(socket,args = undefined) => {
            if (socket.id in players) {
                players[socket.id]["keys"] = args
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

        },
        'end':()=>{

        },
    }
]


function game1() {
    for (var e in players) {
        e = players[e];
        const normal = (e.keys[0] + e.keys[1] + e.keys[2] + e.keys[3]) > 1 ? 0.707 : 1;
        
        e.position[2] = bound(e.position[2], MIN_Z, MAX_Z);
        e.position[0] = bound(e.position[0], MIN_X, MAX_X);
        e.position[2] += dt * 5 * (e.keys[2] - e.keys[0]) * normal;
        e.position[0] += dt * 5 * (e.keys[3] - e.keys[1]) * normal;
        
    }
    io.emit("u",players);
}

function game2() {

}
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

function setIO(newIO) {
    io = newIO;
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
        io.emit("gi",[state,game])
        setTimeout(()=> {
            if (state !=2) {
                console.log("Game Started");
                stateMap[state].end()
                state = 1;
                stateMap[state].start()
                io.emit("gi",[state,game])
                setTimeout(stateSwitchLoop,gameDuration)
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

module.exports = {'setIO':setIO,'startGameLoop':startGameLoop,'initSocket':initSocket}