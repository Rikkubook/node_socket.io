//https://viboloveyou12.medium.com/%E7%94%A8-socket-io-%E6%89%93%E9%80%A0%E5%A4%9A%E4%BA%BA%E8%81%8A%E5%A4%A9%E5%AE%A4-%E4%B8%8B-f7aabc21d3f2
// 打造一個聊天室
// 可以多人

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public")) //使用其中css

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

let users = [];

io.on('connection', function(socket){
    /*是否為新用戶*/
    let isNewPerson = true;
    /*當前登入用戶*/
    let username = null;
    /*監聽登入事件*/
    socket.on('login', function(data){
      for(var i=0; i<users.length; i++){
        isNewPerson = (users[i].username === data.username)? false : true;
      }
      if(isNewPerson){
          username = data.username
          users.push({
              username: data.username
          })
          data.userCount = users.length
          /*發送 登入成功 事件*/
          socket.emit('loginSuccess', data)
          /*向所有連接的用戶廣播 add 事件*/
          io.sockets.emit('add', data)
      }else{
          /*發送 登入失敗 事件*/
          socket.emit('loginFail', '')
      }
    })
    //監聽登出
    socket.on('logout', function(){
      /* 發送 離開成功 事件 */
      socket.emit('leaveSuccess')
      users.map(function(val, index){
          if(val.username === username){
              users.splice(index, 1);
          }
      })
      /* 向所有連接的用戶廣播 有人登出 */
      io.sockets.emit('leave', {username: username, userCount: users.length})
    })

    // 直接離開
    socket.on("disconnecting", () => {
      // 直接離開
      users.map(function(val, index){
        if(val.username === username){
            users.splice(index, 1);
        }
    })
    /* 向所有連接的用戶廣播 有人登出 */
    io.sockets.emit('leave', {username: username, userCount: users.length})
    });
  
    // 訊息
    socket.on('sendMessage', function(data){
      console.log('sendMessage')
      /*發送receiveMessage事件*/
      io.sockets.emit('receiveMessage', data)
    })

    socket.on('receiveMessage', function(data){
      showMessage(data)
  })
})


/*自訂監聽端口*/
server.listen(3000, () => {
  console.log('listening on *:3000');
});