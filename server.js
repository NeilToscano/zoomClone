const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express(); // express
require('dotenv').config()
const server = createServer(app);// crear servidor
const io = new Server(server); // socket io

const { v4: uuid } = require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

const port = 300;

app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`)
})

app.get('/:roomId/:user', (req,res) => {
    res.render('room', { roomId: req.params.roomId, user: req.params.user })
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, 'roomid');
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })
})

server.listen(process.env.PORT | 3000, () => {
    console.log(`escuchando en el puerto: ${ port}`);
})