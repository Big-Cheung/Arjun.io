var socket = io();

//Handle the events
socket.on("connect", () => {
  console.log("Connected to server!");
});

