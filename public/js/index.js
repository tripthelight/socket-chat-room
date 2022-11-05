/**
 * GLOBAL VARIABLE
 */
let socket = io();
let ip = '';
// let gameName = new String();
const GAME_NAME = [
  'taptap',
  'blackandwhite1'
];

// window.localStorage.clear();
// window.sessionStorage.clear();

/**
 * IP CHECK
 */
function getIP(callback) {
  // new Promise() 추가
  return new Promise(function(resolve, reject) {
    $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
      data = data.trim().split('\n').reduce(function(obj, pair) {
        pair = pair.split('=');
        return obj[pair[0]] = pair[1], obj;
      }, {});
      // console.log(data.ip);
      resolve(data.ip);
    });
  });
}

/**
 * SOCKET
 */
socket.on('connect', function() {
  getIP().then(function(ip) {
    const ROOM_NAME_EL = document.querySelectorAll('.roomName');
    for (let i = 0; i < ROOM_NAME_EL.length; i++) {
      socket.emit('userJoin', {
        gameName: ROOM_NAME_EL[i].dataset.name,
        userIP: ip
      });
      if (window.localStorage.getItem(ROOM_NAME_EL[i].dataset.name)) {
        ROOM_NAME_EL[i].value = window.localStorage.getItem(ROOM_NAME_EL[i].dataset.name);
      } else {
        socket.emit('userJoinGameName', {
          gameName: ROOM_NAME_EL[i].dataset.name,
          userIP: ip
        });
      }
    }
  });

  // index: response user name
  socket.on('indexUserName', function(data) {
    // ADD USER NAME
    for (let i = 0; i < GAME_NAME.length; i++) {
      if (data.gameName == GAME_NAME[i]) {
        returnRoomName(GAME_NAME[i], data);
      }
    }
  });

  // index: response user name
  socket.on('indexGameName', function(data) {
    // ADD GAME NAME
    for (let i = 0; i < GAME_NAME.length; i++) {
      if (data.gameName == GAME_NAME[i]) {
        returnGameName(GAME_NAME[i], data);
      }
    }
  });
});
function returnRoomName(_name, _data) {
  let roomEl = document.querySelector('input[data-name=' + _name + ']');
  let userEl = roomEl.parentElement.parentElement.querySelector('input[name="name"]');
  userEl.value = _data.userName;
}
function returnGameName(_name, _data) {
  let roomEl = document.querySelector('input[data-name=' + _name + ']');
  roomEl.value = '';
  roomEl.value = _data.roomName;
  window.localStorage.setItem(_name, _data.roomName);
}

/**
 * DOCUMENT READY
 */
document.onreadystatechange = readyComn;
function readyComn() {if (document.readyState === 'complete') comnInit();}

/**
 * DOCUMENT READY COMMON
 */
function comnInit() {
  // HTML SELECTOR
  // const NAME_EL = document.querySelectorAll('input[name="name"]');
  
  // ADD GAME NAME
  // for (let i = 0; i < NAME_EL.length; i++) NAME_EL[i].value = gameName;
}

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  // console.info( "This page is reloaded" );
  setTimeout(function() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }, 1);
} else {
  // window close
  setTimeout(function() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }, 1);
}