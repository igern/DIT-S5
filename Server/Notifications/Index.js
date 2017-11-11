var clients = [];

var socket_app = require('http').createServer(); 
socket_app.listen(80);
var io = require('socket.io')(socket_app);

io.on('connection', function (socket) {
    console.log("Socket connected -> " + socket.id);
    clients.push(socket.id);

    socket.on('disconnect', function(socket) {
        console.log("Socket disconnected -> " + socket.id);
    });
});

var HeartbeatInterval = setInterval(HeartbeatTimer, 1000);
function HeartbeatTimer() {
    for(i = 0; i < clients.length; i++) {
        if(io.sockets.connected[clients[i]] == undefined) {
            clients.splice(i, 1);
        } else {
            io.sockets.connected[clients[i]].emit("Heartbeat", "");
        }
    }
}

module.exports = Object.freeze({
    AnnounceNewCategory: function(title, id, color) {
        for(i = 0; i < clients.length; i++) {
            if(io.sockets.connected[clients[i]] == undefined) {
                clients.splice(i, 1);
            } else {
                io.sockets.connected[clients[i]].emit("NewCategory", JSON.stringify([title, id, color]));
            }
        }
    }
});