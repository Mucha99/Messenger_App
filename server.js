const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
  
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('join', (login) => {
        console.log('Add new user! ' + socket.id);
        users.push(login);
        console.log(users);
        socket.broadcast.emit('newUser', {author: 'Chat Boy', content: '' + login.name + ' has joined the conversation!'});
    })
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', (login) => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        users.shift(login);
        console.log(users);
        socket.broadcast.emit('userLeft', {author: 'Chat Boy', content: '' + login.name + 'has left the conversation! '})
    });
    console.log('I\'ve added a listener on message event \n');
});