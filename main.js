const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', (socket) => {
    console.log('new conn')

    //disconnected
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (message) => {
        socket.broadcast.emit('msgFromserver',message + '\n')
    })
})

server.listen(3000, () => console.log('server started') );