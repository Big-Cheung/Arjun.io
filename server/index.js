const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});


const delay = 10;
const dt = delay * 0.001;
var connected = 0;

var players = {};

function updatePlayer(){
    for (var e in players) {
        e = players[e];
        const normal = (e.keys[0] + e.keys[1] + e.keys[2] + e.keys[3]) > 1 ? 0.707 : 1;
        e.position[2] += dt * 5 * (e.keys[2] - e.keys[0]) * normal;
        e.position[0] += dt * 5 * (e.keys[3] - e.keys[1]) * normal;
    }
    io.emit("u",players);
}

//socket behavior
timerID = setInterval(updatePlayer,delay);
io.on('connection', function(socket) {
    let timerID;
    //run console log on connect
    console.log("Player connected at ID " + socket.id);
    //Log connected players
    connected++;
    console.log(connected + " players connected");
    socket.emit('pl',players)
    //join event(when player name is chosen)
    socket.on('j', function(args) {
        console.log(socket.id + "joined as " + args);
        players[socket.id] = {};
        players[socket.id]["name"] = args;
        players[socket.id]["position"] = [0,0,0];
        players[socket.id]["keys"] = [false,false,false,false];
        socket.broadcast.emit("j",[socket.id,args]);
    })

    //update event
    socket.on('kc', function(args) {
        console.log("Keyupdate from " + socket.id);
        if (socket.id in players) {
            players[socket.id]["keys"] = args
        }
    })

    //add event handler to disconnect
    socket.on('disconnect', function() {
        //broadcast leave event
        socket.broadcast.emit("l",socket.id);
        console.log("Player disconnected at ID " + socket.id);
        connected--;
        console.log(connected + " players connected");
        if (socket.id in players) {
            delete players[socket.id];
        }
    });
});

//API response
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
    res.send("This is some text!").status(200);
});

//Finalize Express
server.listen(PORT, function() {
    console.log(`Listening on ${server.address().port}`);
});

//Finalize Socket.IO

