const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => { //server connection
  socket.on('chat message', (msg) => { // socket 拿到送出的訊息
    console.log(msg)
    io.emit('chat message', msg); //消息發送給所有人，包括發件人。
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});