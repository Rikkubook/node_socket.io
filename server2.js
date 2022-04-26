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

const users = {}
//用 api 方式建立連線
app.get('/lessen2', function (req, res) {
    users.name = req.query.name
    res.sendFile(__dirname + '/lessen2.html');
})

io.on('connection', function (socket) {
  console.log('1')
  if(users.name == 'Rikku'){
    socket.join("room1"); //進入 \
    console.log('2')
    console.log(io.sockets.adapter.rooms.get('room1').size)

    socket.on('chat message', (msg) => { // 當觸發 'chat message' 拿到送出的訊息
      console.log(msg)
      io.in("room1").emit('get chat message', msg); //消息發送給所有人，包括發件人。
    });
  }else{
    console.log('3')
    socket.join("room2"); //進入 \
    socket.on('chat message', (msg) => { // 當觸發 'chat message' 拿到送出的訊息
      console.log(msg)
      io.in("room2").emit('get chat message', msg); //消息發送給所有人，包括發件人。
    });
    // console.log('不是應該來這裡嗎?')
  }
})

server.listen(4000, () => {
  console.log('listening on *:4000');
});