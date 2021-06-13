const express = require('express');
var data = require('./user');
const { Server } = require("socket.io");
const http = require('http');

app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



io.on('connection', (socket) => {
    var client_ip_address = socket.request.connection._peername;

    //console.log('User Connected on', client_ip_address.address);
    io.emit('user-joinRleft', data[client_ip_address.address] + " Joined the chat room");


    socket.on('disconnect', () => {
        io.emit('user-joinRleft', data[client_ip_address.address] + " left the chat room");
    });
    socket.on('message', (msg) => {
        io.emit('message-recv', data[client_ip_address.address] + " : " + msg);
    });
});

server.listen(3000, () => {
    console.log('Listenng on : 3000');
});

app.get("/", (req, res) => {
    res.render('index');
});

app.post("/chatroom", (req, res) => {
    data[req.ip] = req.body['user-name'];
    res.render('chatroom', { name: data[req.ip] + "\'s" });
})



app.use((req, res) => {
    res.render('404');
})