const express = require("express");
const http = require("http");
const cors = require('cors');

const { Server } = require("socket.io");
const { setIO, initSocket, startGameLoop,setUpdateFunction } = require("./gameServer");
const { 
    attemptLogin, 
    attemptSignup, 
    getUserData, 
    updateUserData
} = require("./firebase.js")

const PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});


//socket behavior
setIO(io);
setUpdateFunction((points,mapping) => {
    for (var socketid in points) {
        if (!(socketid in mapping)) {
            continue;
        }
        let uid = mapping[socketid].uid
        mapping[socketid]["points"] += points["points"]
        mapping[socketid]["wins"] += points["wins"]
        mapping[socketid]["games"] += points["games"]
        updateUserData(uid,mapping[socketid]);
    }
});

startGameLoop();

io.on('connection', function(socket) {
    initSocket(socket);
});
//authentication stuff
app.use(cors());
app.use(express.json());

//API response
app.get("/leaderboard", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.use("/login", (req, res) => {
    console.log(req.body)
    attemptLogin(req.body[0],req.body[1])
    .then((data) =>{
        if (data.status == "success") {
            res.send(data)
            addPlayerData(data.user,req.body[2]);
        } else {
            console.log(data);
            res.send(data);
        }
    })
});

app.use("/signup", (req, res) => {
    console.log(req.body)
    attemptSignup(req.body[0],req.body[1],req.body[2])
    .then((data) =>{
        if (data.status == "success") {
            res.send({status:data.status,username:data.user})
        } else {
            res.send(data);
        }
    })
});


app.get("/", (req, res) => {
    res.send("This is some text!").status(200);
});

//Finalize Express
server.listen(PORT, function() {
    console.log(`Listening on ${server.address().port}`);
});

//Finalize Socket.IO

