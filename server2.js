//var fs = require('fs') //https
//var options = {
  // key: fs.readFileSync('這個網域的 ssl key 位置'),
  // cert: fs.readFileSync('這個網域的 ssl fullchain 位置')
//}

//http & socket port
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const { Server } = require("socket.io");
const io = new Server(server);
let roomNo ='';
let onlineCount = 0;
const users = {}
//用 api 方式建立連線
app.get('/lessen2', function (req, res) {
    roomNo = req.query.roomNo
    res.sendFile(__dirname + '/lessen2.html');
})


io.on('connection', function (socket) {
  socket.join(roomNo); //進入 \
  onlineCount = io.sockets.adapter.rooms.get(roomNo).size

  socket.on('join', (name) => { 
    console.log(name)
    io.in(roomNo).emit('join the room', name); 
  });

  socket.on('chat message', (msg) => { // 當觸發 'chat message' 拿到送出的訊息
    console.log(msg)
    io.in(roomNo).emit('get chat message', msg); //消息發送給所有人，包括發件人。
  });

  socket.on('disconnect', (msg) => {
    console.log(msg)
    console.log('user disconnected');
    io.emit("offline", '已離線');
  });
})

server.listen(4000, () => {
  console.log('listening on *:4000');
});