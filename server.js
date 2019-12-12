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
			rooms[room] = { players: [], spectators: [], game: new GameBoard(), private: prv };
		socket.emit('assign', {to: room});
	});

	socket.on('join', function(name, room){

		socket.join(room);
		socket.room = room;
		if (!(room in rooms))
			rooms[room] = { players: [], game: new GameBoard(), private: true };
		if (!rooms[room].started && rooms[room].players.length < 2) {
			socket.emit('joined', {as: 'player', no: rooms[room].players.length});
			rooms[room].players.push({ name, socket });
			console.log("Client joined " + socket.room + " as player");
		} else {
			socket.emit('joined', {as: 'spectator'});
			if (rooms[room].spectators) {
				rooms[room].spectators.push({ name, socket });
				console.log("Client joined " + socket.room + " as spectator");
				rooms[room].game.log.logs.forEach(log => {
					var datamap = log.type === "identify" ? log.data : log.data.map(d => d ? d.id || d : d);
					socket.emit('notification', {type: log.type, src: log.src.id, data: datamap});
				})
			}
		}
	});

	socket.on('mission', function(name, mission){

		socket.type = "mission";
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
			gb.explain = (type, src, data) => {
				if (room.spectators)
					room.spectators.forEach(spec => spec.socket.emit("notification", {type, src, data}));
			}//io.sockets.clients(socket.room).filter(cli => !players.some(p => p.socket === cli)).forEach(spec => spec.socket.emit("notification", {type, src, data}));
			gb.end = (winner) => {
				gb.ended = true;
				if (players[winner])
					players[winner].socket.emit("endgame", {state: 3}); // State 3 : win
				if (players[1-winner])
					players[1-winner].socket.emit("endgame", {state: 4}); // State 4 : lose
				if (rooms[socket.room].spectators)
					room.spectators.forEach(spec => spec.socket.emit("endgame", {state: 1})); // State 1 : end
				console.log("Game " + socket.room + " ended normally");
				console.log("Room count: " + (rooms.length-1));
				delete rooms[socket.room];
			}

			try {
				gb.init(players[0], players[1]);
				gb.start();
			} catch (e) {
				room.game.ended = true;
				io.sockets.in(socket.room).emit("endgame", {state: 6}); // State 6 : internal error
				console.log("Game " + socket.room + " ended by internal error");
				console.log("Room count: " + (Object.keys(rooms).length-1));
			}
			console.log("Started game " + socket.room);
			console.log("Room count: " + Object.keys(rooms).length);
			room.started = true;
			room.private = true;
		}
	})

	socket.on('command', function(cmd){

		var room = rooms[socket.room];
		if (!room)
			return;
		var no = room.players.findIndex(p => p.socket === socket);
		if (no >= 0) {
			try {
				room.game.command(cmd, no);
			} catch (e) {
				room.game.ended = true;
				io.sockets.in(socket.room).emit("endgame", {state: 6}); // State 6 : internal error
				console.log("Game " + socket.room + " ended by internal error");
				console.log("Room count: " + (Object.keys(rooms).length-1));
			}
		}
	});

	socket.on('leave', function(){

		let room = socket.room;
		console.log("Client leaved " + socket.room);
		socket.leave(room);
		rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
		if (rooms[room].spectators)
			rooms[room].spectators = rooms[room].spectators.filter(p => p.socket !== socket);
	});

	var quit = () => {

		let room = socket.room;
		socket.leave(room);
		if (room && rooms[rooms] && rooms[room].players.every(p => p.socket !== socket))
			return;
		if (room && rooms[room]) {
			rooms[room].players = rooms[room].players.filter(p => p.socket !== socket);
			if (rooms[room].spectators)
				rooms[room].spectators = rooms[room].spectators.filter(p => p.socket !== socket);
			if (rooms[room].started && rooms[room].players.length <= 1) {
				rooms[room].game.ended = true;
				io.sockets.in(socket.room).emit("endgame", {state: 5}); // State 5 : connection lost
				console.log("Game " + socket.room + " ended by connection lost");
				console.log("Room count: " + (Object.keys(rooms).length-1));
			}
		}
		if (room && rooms[room] && rooms[room].players.length == 0)
			delete rooms[room];
	}

	socket.on('quit', quit);

	socket.on('disconnect', quit);
});
