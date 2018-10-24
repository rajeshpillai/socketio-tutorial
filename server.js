/*
    1.  Hello Socket, Server and Client
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

    // Emit an event to the opponent when the player leaves
    socket.on('disconnect', function () {
        console.log("A client disconnected...")
    });
});
