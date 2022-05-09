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

let online =[
  { name: 'Rikku', roomNo : 2},
  { name: 'LuLu', roomNo : 1},
  { name: 'Keven', roomNo : 1},
]

let roomNo = []; // 2
let onlineCount = 0;
const users = {}
//用 api 方式建立連線
app.get('/', function (req, res) {
  roomNo = req.query.roomNo
  res.sendFile(__dirname + '/index.html');
})


io.on('connection', function (socket) { //1
  // socket.join(roomNo); //創立
  onlineCount = io.sockets.adapter.rooms.get(roomNo).size //目前上線人數

  socket.on('join', (name) => { //3
    console.log(socket.id) //sdfsdfsdf
    users[socket.id] = name; //給唯一key  /sdsfsdfd=Rikku
    io.in(roomNo).emit('join the room', name);  // 4
  });

  socket.on('chat message', (msg) => { // 當觸發 'chat message' 拿到送出的訊息
    console.log(msg)
    io.in(roomNo).emit('get chat message', msg); //消息發送給所有人，包括發件人。 //2
  });

  socket.on('disconnect', (msg) => {
    console.log(socket.id)
    console.log(users[socket.id])
    console.log('user disconnected');
    io.emit("offline", `${users[socket.id]} 已離線`);
  });
})

server.listen(4000, () => {
  console.log('listening on *:4000');
});