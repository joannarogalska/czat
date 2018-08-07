const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const UsersService = require('./UsersService');
const userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    //client is listening in order to know if someone has joined the chat
    socket.on('join', function(name){
        console.log(name)
        //we're saving the user who has just joined the chat, into a service with a list of persons which are on the chat now
        userService.addUser({
            id: socket.id,
            name
        });
        //the application emits the event "update". This event updates the information about the list of users. The event "update" is sent to every user present on chat, so every user can get the udpated list of users.
        io.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket) {
    socket.on('disconnect', () => {
        userService.removeUser(socket.id);
        socket.broadcast.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket) {
    socket.on('message', function(message){
        const {name} = userService.getUserById(socket.id);
        socket.broadcast.emit('message', {
            text: message.text,
            from: name
        });
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});
