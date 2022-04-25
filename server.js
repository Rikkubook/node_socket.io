const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => { //server connection 回呼
  socket.join("room 237"); //進入 
  console.log(socket.rooms); 
  socket.on('chat message', (id,msg) => { // 當觸發 'chat message' 拿到送出的訊息
    io.to("room 237").emit('get chat message', msg); //消息發送給所有人，包括發件人。
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});