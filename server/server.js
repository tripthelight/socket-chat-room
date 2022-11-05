const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');
const {randomName} = require('./utils/randomName');
const {loadJSON,saveJSON} = require('./utils/databases');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
let userIP = null;
let userName = null;
let roomName = null;
let gameNameArray = [];
let roomNameArray = [];

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("A new user just connected");

  // index.html user join
  socket.on('userJoin', data => {
    // only name
    if (userIP) {
      io.emit('indexUserName', {gameName: data.gameName, userName: userName});
    } else {
      userIP = String(data.userIP);
      let firstName = randomName(20);
      userName = firstName;
      io.emit('indexUserName', {gameName: data.gameName, userName: firstName});
    }
  });

  socket.on('userJoinGameName', data => {
    // roomName = data.gameName + '-' + Math.floor(person / 2);
    let state = false;
    const jsonData = loadJSON('./server/databases/'+data.gameName+'.json');
    if (jsonData.length == 0) {
      roomName = randomName(20);
      jsonData.push({"name":roomName, "person":"1"});
    } else {
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].person == '1') {
          roomName = jsonData[i].name;
          jsonData[i].person = '2';
          state = true;
          break;
        }
      }
      if (!state) {
        roomName = randomName(20);
        jsonData.push({"name":roomName, "person":"1"});
      }
    }
    saveJSON('./server/databases/'+data.gameName+'.json', jsonData);
    io.emit('indexGameName', {gameName: data.gameName, roomName: roomName});
    roomNameArray.push(roomName);
    gameNameArray.push(data.gameName);
  });

  // add game room
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is the server:');
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
    }

    // browser close or refresh event
    for (let i = 0; i < gameNameArray.length; i++) {
      let jsonData = loadJSON('./server/databases/'+gameNameArray[i]+'.json');
      for (let j = 0; j < roomNameArray.length; j++) {
        for (let k = 0; k < jsonData.length; k++) {
          if (jsonData[k].name == roomNameArray[j]) {
            if (jsonData[k].person == '2') {
              jsonData[k].person == '1';
            } else {
              jsonData.splice(k, 1);
            }
          }
          saveJSON('./server/databases/'+gameNameArray[i]+'.json', jsonData);
        }
      }
    }
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
