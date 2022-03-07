const express = require("express");
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");
const { setIO, initSocket, startGameLoop } = require("./gameServer");

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});


//socket behavior
setIO(io);
startGameLoop();

io.on('connection', function(socket) {
    initSocket(socket);
});

//API response
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
app.use(cors());
app.use("/login", (req, res) => {
    res.send({
        token: 'test123',
      });
});
app.get("/", (req, res) => {
    res.send("This is some text!").status(200);
});

//Finalize Express
server.listen(PORT, function() {
    console.log(`Listening on ${server.address().port}`);
});

//Finalize Socket.IO

