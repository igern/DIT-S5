var clients = [];

var socket_app = require('http').createServer(); 
socket_app.listen(80);
var io = require('socket.io')(socket_app);

io.on('connection', function (socket) {
    console.log("ID at creation -> " + socket.id);
    clients.push(socket.id);

    socket.on('disconnect', function(socket) {
        console.log("ID at deletion -> " + socket.id);
        console.log("Before -> " + clients.length);
        delete clients[socket.id];
        console.log("After -> " + clients.length);
    });
});

var NotificationInterval = setInterval(NotificationTimer, 1000);
function NotificationTimer() {
    for(i = 0; i < clients.length; i++) {
        if(io.sockets.connected[clients[i]] == undefined) {
            clients.splice(i, 1);
        } else {
            io.sockets.connected[clients[i]].emit("Greeting", "Num -> ");
        }
    }
}