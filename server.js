const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app = express(); // express

const server = createServer(app);// crear servidor
const io = new Server(server); // socket io

const { v4: uuid } = require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

const port = 3000;

app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`)
})

app.get('/:roomId', (req,res) => {
    res.render('room', { roomId: req.params.roomId})
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, 'roomid');
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })
})

server.listen(port, () => {
    console.log(`escuchando en el puerto: ${ port}`);
})