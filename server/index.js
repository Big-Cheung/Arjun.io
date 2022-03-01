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

    //name event
    socket.on('nameChosen', function(socket, args) {
        players[socket.id] = {};
        players[socket.id]["name"] = args;
    })


    //add event handler to disconnect
    socket.on('disconnect', function() {
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

