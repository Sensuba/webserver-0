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
	start();
}, err => {

	console.log(`Error code: ${err.code}`);
	console.log(`Unable to load data from ${err.hostname}`);
});

var checkDeck = (token, deck) => {

	return true;
}

var start = () => io.sockets.on('connection', function (socket) {

	socket.emit('connected');

	socket.on('seek', function(prv){

		if (!prv) {
			var pubKeys = Object.keys(rooms).filter(key => !rooms[key].private);
			if (pubKeys.length > 0) {
				var key = pubKeys[Math.floor(Math.random() * pubKeys.length)];
				socket.emit('assign', {to: key});
				return;
			}
		}
		var batch = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var room = "";
		for (var i = 0; i < 10; i++)
			room += batch.charAt(Math.floor(Math.random() * batch.length));
		if (!(room in rooms))
			rooms[room] = { players: [], game: new GameBoard(), private: prv };
		socket.emit('assign', {to: room});
	});

	socket.on('join', function(room){

		console.log("join " + room);
		socket.join(room);
		socket.room = room;
		if (!(room in rooms))
			rooms[room] = { players: [], game: new GameBoard(), private: true };
		if (!rooms[room].started && rooms[room].players.length < 2) {
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

		var players = rooms[socket.room].players;
		var room = rooms[socket.room];
		var p = players.find(player => player.socket === socket);
		p.token = token;
		p.deck = deck;
		p.ready = true;

		if (!room.started && players.length === 2 && players.every(player => player.ready)) {

			var gb = rooms[socket.room].game;
			gb.send = (type, src, data) => io.sockets.in(socket.room).emit("notification", {type, src, data});
			gb.whisper = (type, player, src, ...data) => players[player] ? players[player].socket.emit("notification", {type, src, data}) : {};
			gb.init(players[0].deck, players[1].deck);
			gb.start();
			room.started = true;
			room.private = true;
		}
	})

	socket.on('command', function(cmd){

		var room = rooms[socket.room];
		var no = room.players.findIndex(p => p.socket === socket);
		if (no >= 0)
			room.game.command(cmd, no);
	});

	socket.on('leave', function(){

		let room = socket.room;
		console.log("leave " + room);
		socket.leave(room);
		rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
	});

	var quit = () => {

		let room = socket.room;
		socket.leave(room);
		if (room)
			rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
		if (room && rooms[room].players.length == 0)
			delete rooms[rooms];
	}

	socket.on('quit', quit);

	socket.on('disconnect', quit);
});