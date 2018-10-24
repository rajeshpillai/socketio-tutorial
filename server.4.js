/*
    1.  Hello Socket, Server and Client
    2.  Using built in 'message' Event
    3.  Using custom events
    4.  Emitting events from the client
*/

var express = require('express'),
    app = express(),
    http = require('http').Server(app);

let port = 5000;

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

    // Send a message to client -> Default 'message' event
    socket.send("Welcome to the world of Socket Programming!");

    // Send a custom event to the connected client->one-on-one
    socket.emit('on-join', {
        id: socket.id,
        message: "You just joined the network!"
    });

    // todo:
    socket.on("client-hello", (data) => {
        console.log("Client says : ", data);
    })

    // Emit an event to the opponent when the player leaves
    socket.on('disconnect', function () {
        console.log("A client disconnected...")
    });
});
