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
    }
  });

  // index: response room name
  socket.on('indexUserJoin', function(data) {
    // ADD ROOM NAME
    for (let i = 0; i < GAME_NAME.length; i++) {
      if (data.gameName == GAME_NAME[i]) {
        returnRoomName(GAME_NAME[i], data);
      }
    }
  });
});
function returnRoomName(_name, _data) {
  let roomEl = document.querySelector('input[data-name=' + _name + ']');
  roomEl.value = '';
  roomEl.value = _data.roomName;
  let userEl = roomEl.parentElement.parentElement.querySelector('input[name="name"]');
  userEl.value = _data.userName;
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