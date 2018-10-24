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


io.on('connection', function (socket) {
    console.log("A client connected...", socket.id);
    clients.push({ id: socket.id });

    // Notify everyone including sender
    socket.emit('on-new-client-connected', {
        message: `Welcome ${socket.id}: Total connections ${clients.length}`
    });


    // Notify everyone including sender
    socket.emit('on-new-client-connected', {
        message: `Welcome ${socket.id}: <br/> Total connections ${clients.length}`
    });


    socket.on('disconnect', function () {
        console.log("A client disconnected...");
        clients = clients.filter((client) => {
            if (client.id !== socket.id) {
                return true;
            }
        });

        io.sockets.emit('on-client-disconnected', {
            message: `Total connections ${clients.length}`
        });
    });
});
