var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 8080);
var io = require('socket.io').listen(server);

var rooms = {};

var Bank = require("./Bank.js");
var GameBoard = require('./model/GameBoard');

console.log("Initialization...");
Bank.init('https://bhtwey7kwc.execute-api.eu-west-3.amazonaws.com/alpha', () => {

	console.log("Initialized !");
});

var checkDeck = (token, deck) => {

	return true;
}

io.sockets.on('connection', function (socket) {

	console.log("connect");
	socket.emit('connected');

	socket.on('join', function(room){

		console.log("join " + room);
		socket.join(room);
		socket.room = room;
		if (!(room in rooms))
			rooms[room] = { players: [], game: new GameBoard() };
		if (rooms[room].players.length < 2) {
			socket.emit('joined', {as: 'player', no: rooms[room].players.length});
			rooms[room].players.push({ socket: socket });
		} else {
			socket.emit('joined', {as: 'spectator'});
		}
	});

	socket.on('prepare', function(token, deck){

		if (!checkDeck(token, deck)) {
			return;
		}

		var gb = rooms[socket.room].game;
		gb.notify = (type, src, ...data) => io.sockets.in(socket.room).emit("notification", {type, src, data});
		gb.whisper = (type, player, src, ...data) => rooms[socket.room].players[player] ? rooms[socket.room].players[player].socket.emit("notification", {type, src, data}) : {};
		gb.init(deck, deck);
		gb.start();
	})

	socket.on('command', function(cmd){

		var room = rooms[socket.room];
		var no = room.players.findIndex(p => p.socket === socket) + 1;
		if (no > 0)
			room.game.command(cmd, no);
	});

	socket.on('leave', function(){

		let room = socket.room;
		console.log("leave " + room);
		socket.leave(room);
		rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
	});

	socket.on('disconnect', function(){

		console.log("disconnect");
		let room = socket.room;
		socket.leave(room);
		if (room)
			rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
	});
});