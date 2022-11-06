const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {randomName} = require('./utils/randomName');
const {loadJSON,saveJSON} = require('./utils/databases');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
let roomId = null;

const taptap = io.of('/taptap');
const blackandwhite1 = io.of('/blackandwhite1');

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.get('/taptap', (req, res) => {res.sendFile(publicPath + '/taptap.html');});
app.get('/blackandwhite1', (req, res) => {res.sendFile(publicPath + '/blackandwhite1.html');});

// namespace: taptap
taptap.on('connection', (socket) => {
  console.log('taptap 네임스페이스에 접속');
  
  let state = false;
  const jsonData = loadJSON('./server/databases/taptap.json');
  if (jsonData.length == 0) {
    roomId = randomName(20);
    jsonData.push({"name":roomId, "person":"1"});
  } else {
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].person == '1') {
        roomId = jsonData[i].name;
        jsonData[i].person = '2';
        state = true;
        break;
      }
    }
    if (!state) {
      roomId = randomName(20);
      jsonData.push({"name":roomId, "person":"1"});
    }
  }
  saveJSON('./server/databases/taptap.json', jsonData);

  socket.join(roomId).emit('create', {
    room: roomId,
    count: taptap.adapter.rooms[roomId].length
  });
  socket.to(roomId).emit('newUserjoin', {
    room: roomId,
    count: taptap.adapter.rooms[roomId].length
  });







  // jsonData.push({"name":roomId, "person":"1"});
  // console.log('jsonData : ', jsonData);
  // saveJSON('./server/databases/taptap.json', jsonData);
  
  // console.log(io.of('/taptap'));

  // const clientKeys = Object.keys(io.of('/taptap').clients().connected);
  // const clientValues = Object.values(io.of('/taptap').clients().connected);
  // console.log(clientValues.length);

  // if (clientValues.length % 2 == 0) {
  //   let roomId = randomName(10); 
  //   socket.join(roomId).emit('create', {
  //     room: roomId,
  //     count: taptap.adapter.rooms[roomId].length
  //   });
  //   socket.to(roomId).emit('newUserjoin', {
  //     room: roomId,
  //     count: taptap.adapter.rooms[roomId].length
  //   });
  //   console.log(`${roomId} 방에 접속`);
  // }




  // socket.emit('usercount', io.engine.clientsCount);
  // const req = socket.request;
  // const {headers: {referer}} = req;
  // let roomId = referer.split('/')[referer.split('/').length-1].replace(/\?.+/, '');
  // roomId = 'taptap1';
  // if (io.engine.clientsCount == 2) roomId = randomName(10);
  // console.log('count : ', io.engine.clientsCount);

  // if (taptap.adapter.rooms[roomId].length > 2) {
  //   roomId = randomName(10);
  // }

  // socket.join((roomId), () => {
  //   let rooms = taptap.adapter.rooms;
  //   let room = rooms[roomId];

  //   if (room.length > 2) {
  //     console.log('입장 불가');
  //     socket.disconnect();
  //     console.log(taptap.adapter.rooms[roomId].length);
  //   }
  //   console.log(taptap.adapter.rooms[roomId].length);

  //   socket.to(roomId).emit('join', {
  //     room: roomId,
  //     count: taptap.adapter.rooms[roomId].length
  //   });
  // });
  
  // console.log(`${roomId} 방에 접속함`);
  // console.log(taptap.adapter.rooms[roomId].length);

  socket.on('disconnect', () => {
    console.log('taptap 네임스페이스 접속 해제');
    // socket.to(roomId).emit('usercount', io.engine.clientsCount);
    // socket.to(roomId).emit('leave', taptap.adapter.rooms[roomId].length);

    // socket.leave(roomId);
    // const currentRoom = socket.adapter.rooms[roomId];
    // const userCount = currentRoom ? currentRoom.length : 0;

    socket.leave(roomId);

    const jsonData = loadJSON('./server/databases/taptap.json');
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].name == roomId) {
        if (jsonData[i].person == '2') {
          jsonData[i].person = '1';
          // socket.to(roomId).emit('youWin', 'win');
          break;
        } else if (jsonData[i].person == '1') {
          jsonData.splice(i, 1);
          // socket.to(roomId).emit('youDie', 'die');
          break;
        }
      }
    }
    saveJSON('./server/databases/taptap.json', jsonData);

    // socket.broadcast.to(roomId).emit('youWin', 'win');
  });
});









// io.on('connection', (socket) => {
//   console.log("A new user just connected");

//   // add game room
//   socket.on('join', (params, callback) => {
//     if(!isRealString(params.name) || !isRealString(params.room)) {
//       return callback('Name and room are required');
//     }

//     socket.join(params.room);
//     users.removeUser(socket.id);
//     users.addUser(socket.id, params.name, params.room);

//     io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
//     socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));

//     socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));

//     callback();
//   });

//   socket.on('createMessage', (message, callback) => {
//     let user = users.getUser(socket.id);

//     if(user && isRealString(message.text)){
//       io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
//     }
//     callback('This is the server:');
//   });

//   socket.on('disconnect', () => {
//     let user = users.removeUser(socket.id);

//     if(user){
//       io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
//       io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
//     }
//   });
// });

// io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
//   // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
  
//   //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
//   socket.emit('usercount', io.engine.clientsCount);

//   //기본적으로 채팅방 하나에 접속시켜준다.
//   socket.join("채팅방 1");

//   // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
//   socket.on('message', (msg, roomname) => {
//     //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
//     console.log('Message received: ' + msg);
//     console.log('roomname: ' + roomname);

//     // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
//     io.to(roomname).emit('message', msg);
//   });

//   // 룸 전환 신호
//   socket.on('joinRoom', (roomname, roomToJoin) => {
//     socket.leave(roomname); // 기존의 룸을 나가고
//     socket.join(roomToJoin);  // 들어갈 룸에 들어간다.

//     // 룸을 성공적으로 전환했다는 신호 발송
//     socket.emit('roomChanged', roomToJoin);
//   });
// });

// const taptap = io.of('/taptap');

// // 네임스페이스의 연결 처리는 제각각이다. 그러므로 연결 콜백을 다시 만들어야 한다.
// taptap.on('connection', (socket) => {
//   // 룸의 목록 요청시 / 네임스페이스의 룸 목록 반환
//   socket.on('getRooms', () => { 
//     // 다른 네임스페이스의 객체에도 접근할 수 있다.
//     socket.emit('rooms', io.sockets.adapter.rooms);
//   });
// });

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
