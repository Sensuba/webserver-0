require('newrelic');
require('dotenv').config();
var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 8080);
var io = require('socket.io').listen(server);

var rooms = {};

var Bank = require("./Bank.js");
var RoomManager = require("./RoomManager");
var MissionManager = require("./MissionManager");
var TrainingManager = require("./TrainingManager");
var CreditManager = require("./CreditManager");

console.log("Initialization...");
var axios = require('axios');
var api = axios.create({
	baseURL: 'https://bhtwey7kwc.execute-api.eu-west-3.amazonaws.com/alpha',
  	headers: { 'X-Requested-With': 'XMLHttpRequest' }
});
api.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.token;
Bank.init(api, () => {

	console.log("Initialized !");
	start();
}, err => {

	console.log(`Error code: ${err.code}`);
	console.log(`Unable to load data from ${err.hostname}`);
});
CreditManager.init(api);

var creditsFor = (time, log, floor = true) => {

	var t = (time)/1000;
	var a = Math.max(0, log-150);
	var c = Math.max(0, (2.145+(-2.145-0.027)/(1+Math.pow(t/278, 1.93))) * (a/(a+100)) * 13.5);
	return floor ? Math.floor(c) : c;
}

var creditPlayer = (name, credit) => {

	if (credit > 0)
		api.post("/admin/credits", { username: name, credit: credit, mode: "+" });
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
		var roomname = "";
		for (var i = 0; i < 10; i++)
			roomname += batch.charAt(Math.floor(Math.random() * batch.length));
		if (!(roomname in rooms))
			rooms[roomname] = new RoomManager(roomname, prv);
		socket.emit('assign', {to: roomname});
	});

	socket.on('join', function(name, avatar, roomname){

		socket.join(roomname);
		socket.room = roomname;
		if (!(roomname in rooms))
			rooms[roomname] = new RoomManager(roomname);
		var manager = rooms[roomname];
		socket.manager = manager;
		manager.join(socket, name, avatar);
	});

	socket.on('mission', function(name, avatar, mission){

		socket.mission = mission;
		socket.manager = new MissionManager(mission);
		var manager = socket.manager;
		manager.init(socket, name, avatar);
	});

	socket.on('training', function(name, avatar, deck, ai){

		socket.training = true;
		socket.manager = new TrainingManager(ai);
		var manager = socket.manager;
		manager.init(socket, name, avatar, deck);
	});

	socket.on('prepare', function(token, deck){

		if (!socket.manager)
			return;

		var manager = socket.manager;
		manager.prepare(socket, deck, token);
		if (manager.finished) {
			delete rooms[manager.room];
			console.log("Room count: " + Object.keys(rooms).length);
		}
	})

	socket.on('command', function(cmd){

		var manager = socket.manager;
		if (!manager)
			return;
		manager.command(socket, cmd);
		if (manager.finished) {
			delete rooms[manager.room];
			console.log("Room count: " + Object.keys(rooms).length);
		}
	});

	socket.on('leave', function(){

		console.log("Client leaved " + socket.room);
		var manager = socket.manager;
		if (!manager)
			return;
		manager.kick(socket);
	});

	var quit = () => {

		if (socket.room) {
			var roomname = socket.room;
			socket.leave(roomname);
			var manager = rooms[roomname];
			if (!manager)
				return;
			manager.kick(socket);
			if (manager.finished) {
				delete rooms[manager.room];
				console.log("Room count: " + Object.keys(rooms).length);
			}
		} else manager.kick(socket);
	}

	socket.on('quit', quit);

	socket.on('disconnect', quit);
});
