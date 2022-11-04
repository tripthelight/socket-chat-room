const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {isName} = require('./utils/isName');
const {Users} = require('./utils/users');
const {randomName} = require('./utils/randomName');
const {loadJSON,saveJSON} = require('./utils/databases');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
let userIP = null;
let userName = null;
let roomName = null;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("A new user just connected");
  // index.html user join
  socket.on('userJoin', data => {
    if (userIP) {
      roomName = randomName(20);
      io.emit('indexUserJoin', {gameName: data.gameName, roomName: roomName, userName: userName});
    } else {
      roomName = randomName(20);
      userIP = String(data.ip);
      let firstName = randomName(20);
      userName = firstName;
      io.emit('indexUserJoin', {gameName: data.gameName, roomName: roomName, userName: firstName});
    }
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
  })

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is the server:');
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
    }
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
