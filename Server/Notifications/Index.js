var clients = [];
var ActiveCategoryDirectory = [];
var ActiveThreadDirectory = [];

var socket_app = require('http').createServer(); 
socket_app.listen(80);
var io = require('socket.io')(socket_app);

io.on('connection', function (socket) {
    // console.log("Socket connected -> " + socket.id);
    clients.push(socket.id);

    socket.on('ActiveCategory', function(data) {
        // console.log(socket.id + " is browsing posts in category id -> " + data);
        ActiveCategoryDirectory[socket.id] = data;
    });

    socket.on('ActiveThread', function(data) {
        // console.log(socket.id + " is looking at thread by id -> " + data);
        ActiveThreadDirectory[socket.id] = data;
    });

    socket.on('disconnect', function(socket) {
        // console.log("Socket disconnected -> " + socket.id);
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
    },

    AnnounceDeletedThread: function(id) {
        for(i = 0; i < clients.length; i++) {
            if(io.sockets.connected[clients[i]] == undefined) {
                clients.splice(i, 1);
            } else {
                io.sockets.connected[clients[i]].emit("DeletedThread", JSON.stringify([id]));
            }
        }
    },

    AnnounceNewThread: function(categoryid, threadid, title, created) {
        for(i = 0; i < clients.length; i++) {
            if(io.sockets.connected[clients[i]] == undefined) {
                clients.splice(i, 1);
            } else {
                if(ActiveCategoryDirectory[clients[i]] == categoryid || ActiveCategoryDirectory[clients[i]] == 'all') {
                    io.sockets.connected[clients[i]].emit("NewThread", JSON.stringify([categoryid, threadid, title, created]));
                }
            }
        }
    },

    AnnounceDeletedPost: function(postid, threadid) {
        for(i = 0; i < clients.length; i++) {
            if(io.sockets.connected[clients[i]] == undefined) {
                clients.splice(i, 1);
            } else {
                if(ActiveThreadDirectory[clients[i]] == threadid) {
                    io.sockets.connected[clients[i]].emit("DeletedPost", JSON.stringify([postid]));
                }
            }
        }
    },

    AnnounceNewPost: function(threadid, postid, content, created, creator) {
        for(i = 0; i < clients.length; i++) {
            if(io.sockets.connected[clients[i]] == undefined) {
                clients.splice(i, 1);
            } else {
                if(ActiveThreadDirectory[clients[i]] == threadid) {
                    io.sockets.connected[clients[i]].emit("NewPost", JSON.stringify([threadid, postid, content, created, creator]));
                }
            }
        }
    }
});