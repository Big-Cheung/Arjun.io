const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);



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