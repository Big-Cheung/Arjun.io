const  { initializeApp } = require('firebase/app');
const fb = require('./database/firebase.js');
const database = require('firebase/database');
//const auth = require('./public/database/auth.js');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);
//initialize Firebase
const fbApp = initializeApp(fb.firebaseConfig);
const db = database.getDatabase(fbApp);




// express behavior
const port = 8081;
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/public/signup.html');
});

app.post('/word', )

//socket listening
server.listen(port, function() {
  console.log(`Listening on ${server.address().port}`);
});