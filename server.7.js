/*
    1.  Hello Socket, Server and Client
    2.  Using built in 'message' Event
    3.  Using custom events
    4.  Emitting events from the client
    5.  Broadcasting -> Sending message to all conected clients
        USE: io.sockets.emit (all client including the client that might have fired
             this event)

    6.  Broadcasting to everyone except to the  sender
        USE:  socket.broadcast.emit
    
    7.  Custom namespace:  USE io('/your-custom-namespace');
        Custom namespace helps us create a different channels for different
        types of messages:
        For .e.g  All chat messages go through one channel and all upload 
        notifications may to through different channel, etc..
        It helps us organize our application in a better way.

*/

var express = require('express'),
    app = express(),
    http = require('http').Server(app);

let port = 5000;

// TODO: Array of sockets/clients
let clients = [];

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function () {
    console.log(`Socket server running on port ${port}`);
});


const io = require('socket.io')(http);

let chatRoom = io.of('/chat-room');

chatRoom.on('connection', function (socket) {
    console.log("A client connected...", socket.id);
    clients.push({ id: socket.id });

    // Notify everyone including sender
    chatRoom.emit('on-new-client-connected', {
        message: `Welcome ${socket.id}: <br/> Total connections ${clients.length}`
    });


    // Notify everyone except sender
    socket.broadcast.emit('on-new-client-connected', {
        message: `Total connections ${clients.length}`
    });


    socket.on('disconnect', function () {
        console.log("A client disconnected...");
        clients = clients.filter((client) => {
            if (client.id !== socket.id) {
                return true;
            }
        });

        chatRoom.emit('on-client-disconnected', {
            message: `Total connections ${clients.length}`
        });
    });
});
