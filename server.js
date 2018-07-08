var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 8080);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	console.log("connect");
	socket.emit('connected');

	socket.on('join', function(room){

		console.log("join " + room);
		socket.join(room);
	});

	socket.on('leave', function(){

		console.log("leave " + socket.room);
		socket.leave(socket.room);
	});

	socket.on('disconnect', function(){

		console.log("disconnect");
		socket.leave(socket.room);
	});
});