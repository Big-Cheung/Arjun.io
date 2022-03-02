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

var connected = 0;

var players = {};

//socket behavior
io.on('connection', function(socket) {
    //run console log on connect
    console.log("Player connected at ID " + socket.id);
    //Log connected players
    connected++;
    console.log(connected + " players connected");
    socket.emit('pl',players)

    //join event(when player name is chosen)
    socket.on('j', function(args) {
        players[socket.id] = {};
        players[socket.id]["name"] = args;
        players[socket.id]["position"] = [0,0,0];
        players[socket.id]["keys"] = [false,false,false,false];
        socket.broadcast("j",[players[socket.id],socket.id]);
    })

    socket.on('kc', function(args) {
        socket.broadcast("kd",[socket.id,args])
        players[socket.id]["keys"] = args[0]
        players[socket.id]["position"] = args[1]
    })

    //add event handler to disconnect
    socket.on('disconnect', function() {
        socket.broadcast("l",socket.id);
        console.log("Player disconnected at ID " + socket.id);
        connected--;
        console.log(connected + " players connected");
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

