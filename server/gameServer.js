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

const MIN_X = -15
const MAX_X = 15
const MIN_Z = -15
const MAX_Z = 15



const stateMap = [
//State 0
    {   
        'join':(socket,args) => {
            players[socket.id] = {};
            players[socket.id]["name"] = args;
            players[socket.id]["position"] = [0,0,0];
            players[socket.id]["keys"] = [false,false,false,false];
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
        }
    },

//State 1
    {
        'join':(socket,args = undefined) => {
            lobby[socket.id] = {};
            lobby[socket.id]["name"] = args;
            lobby[socket.id]["position"] = [0,0,0];
            lobby[socket.id]["keys"] = [false,false,false,false];
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
            let v = Object.keys(players);
            for (var e in players) {
                e = players[e];
                const normal = (e.keys[0] + e.keys[1] + e.keys[2] + e.keys[3]) > 1 ? 0.707 : 1;
                e.position[2] += dt * 5 * (e.keys[2] - e.keys[0]) * normal;
                e.position[0] += dt * 5 * (e.keys[3] - e.keys[1]) * normal;
            }
            io.emit("u",players);
        }
    }
]

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

function nextState() {
    switch(state){
        case 0: 
            for (key in players) {

            }
            break;
        case 1:
            break;
    }
}


function setIO(newIO) {
    io = newIO;
}

function startGameLoop() {
    loopTimer = setInterval(stateMap[state].update,delay);
}

function initSocket(socket) {
    //run console log on connect
    socket.emit('pl',players)

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