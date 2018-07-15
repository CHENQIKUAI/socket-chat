var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

var iNumUsers = 0;

io.on('connection', function (socket) {
    ++iNumUsers;
    socket.on('nickname', function (name) {
        socket.nickname = name;
        socket.broadcast.emit('a user join', `${name} joined!`); // everyone gets it but the sender
        io.emit('how many people', iNumUsers);
    })

    socket.on('chat message', function (data) {
        io.emit('chat message', data);
    });

    socket.on('disconnect', function () {
        --iNumUsers;
        socket.broadcast.emit('a user go', `${socket.nickname} left!`);
        io.emit('how many people', iNumUsers);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});