const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))

io.on('connection', (socket) => {

    //disconnected
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    //got a message from a client (text)
    socket.on('message', (message) => {
        socket.emit('msgFromserver',message + '\n')
    })

    //got a message from a client (image)
    socket.on('message-image', (message_image) => socket.emit('imageFromServer', message_image))

    // get the username from the user
    socket.on('gotUsername', (username) => {
        console.log(`${username} a intrat pe server man`)
        socket.broadcast.emit('msgFromserver', `${username} a intrat pe server man \n`)
    })
})

server.listen(3000, () => console.log('server started') );