var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];

console.log('websockets server started');

ws.on('connection', function(socket) {
  console.log('client connection established');
    //sends old messages to newly connected clients
  messages.forEach(function (msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    console.log('message received: ' + data);
    messages.push(data);
        //socket.send(data);
        //sends new messages to clients
    ws.clients.forEach(function (clientSocket) {
      clientSocket.send(data);
    });
  });
});
