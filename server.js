const  { initializeApp } = require('firebase/app');
const fb = require('./public/database/firebase.js');
const { getFirestore } = require('firebase/firestore');
//const auth = require('./public/database/auth.js');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);
//initialize Firebase
initializeApp(fb.firebaseConfig);
console.log(fb.firebaseConfig)
const db = getFirestore();

io.on('connection', function(socket) {
  //run console log on connect
  console.log("Player connected at ID " + socket.id);
  //add event handler to disconnect
  socket.on('disconnect', function() {
    console.log("Player disconnected at ID " + socket.id);
  });
});

const port = 8081;
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(port, function() {
  console.log(`Listening on ${server.address().port}`);
});