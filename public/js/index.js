/**
 * GLOBAL VARIABLE
 */
let socket = io();

/**
 * SOCKET
 */
socket.on('connect', function() {
  
});

/**
 * DOCUMENT READY
 */
document.onreadystatechange = readyComn;
function readyComn() {if (document.readyState === 'complete') comnInit();}

/**
 * DOCUMENT READY COMMON
 */
function comnInit() {

}
