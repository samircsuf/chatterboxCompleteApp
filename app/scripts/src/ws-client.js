let socket;
//initialize ws connection to connect to web-socket server
function init(url) {
  socket = new WebSocket(url);
  console.log('connecting...');
}
//opens a socket connection through which messages can be sent
function registerOpenHandler(handlerFunction) {
  socket.onopen = () => {
    console.log('open');
    handlerFunction();
  };
}
//receives a message on socket from server and invokes handlerFunction() with the incoming data to form the message
function registerMessageHandler(handlerFunction) {
  socket.onmessage = (e) => {
    console.log('message', e.data);
    let data = JSON.parse(e.data);
    handlerFunction(data);
  };
}
//sends JSON payload object to socket server
function sendMessage(payload) {
  socket.send(JSON.stringify(payload));
}

export default {
  init,
  registerOpenHandler,
  registerMessageHandler,
  sendMessage
};
