var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");

class RoomManager extends Manager {

	constructor (room, prv = true) {

		super("room");
		this.room = room;
		this.private = prv;
		this.players = [];
		this.spectators = [];
	}

	broadcast (e, data) {

		this.players.forEach(p => p.socket.emit(e, data));
		this.spectators.forEach(s => s.socket.emit(e, data));
	}

	join (socket, name, avatar) {

		if (!this.started && this.players.length < 2) {
			socket.emit('joined', {as: 'player', no: this.players.length});
			this.players.push({ name, avatar, socket });
			console.log((name || "Anonymous") + " joined " + this.room + " as player");
		} else {
			socket.emit('joined', {as: 'spectator'});
			this.spectators.push({ name, socket });
			this.game.log.logs.forEach(log => {
				var datamap = log.type === "identify" ? log.data : log.data.map(d => d ? d.id || d : d);
				socket.emit('notification', {type: log.type, src: log.src.id, data: datamap});
			})
			console.log((name || "Anonymous") + " joined " + this.room + " as spectator");
		}
	}

	prepare (socket, deck, token) {

		if (!DeckAnalyst.check(deck, token))
			return;

		var player = this.players.find(p => p.socket === socket);
		var players = this.players;
		var that = this;
		player.token = token;
		player.deck = deck;
		player.ready = true;
		this.whispers = [[], []]

		if (!this.started && players.length === 2 && players.every(p => p.ready)) { // Ready to start

			this.game.send = (type, src, data) => this.broadcast("notification", {type, src, data});
			this.game.whisper = (type, no, src, ...data) => {
				if (players[no]) {
					players[no].socket.emit("notification", {type, src, data});
					this.whispers[no].push({type, src, data});
					that.players.forEach(p => {
						if (p.access && p !== players[no] && p.access.some(e => e === no))
							p.socket.emit("notification", {type, src, data});
					});
					that.spectators.forEach(s => {
						if (s.access && s.access.some(e => e === no))
							s.socket.emit("notification", {type, src, data});
					});
				}
			}
			this.game.explain = (type, src, data) => {
				if (this.spectators)
					this.spectators.forEach(s => s.socket.emit("notification", {type, src, data}));
			}
			this.game.end = (winner) => {
				
				if (this.game.ended)
					return;
				this.game.ended = true;

				var custom = players.some(player => typeof player.deck.hero === "object" || player.deck.body.some(card => typeof card === "object"));

				var creditsW = 0, creditsL = 0;
				if (players.length > 1 && players[winner].name !== players[1-winner].name) {
					var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length, false)
					if (players[winner].name) creditsW = custom ? Math.floor(c * 1.5) : Math.floor(c * 2.5);
					if (players[1-winner].name) creditsL = custom ? Math.floor(c * 1.5) : Math.floor(c);
					CreditManager.creditPlayer(players[winner].name, creditsW);
					CreditManager.creditPlayer(players[1-winner].name, creditsL);
				}

				if (players[winner])
					players[winner].socket.emit("endgame", {state: 3, credit: creditsW}); // State 3 : win
				if (players[1-winner])
					players[1-winner].socket.emit("endgame", {state: 4, credit: creditsL}); // State 4 : lose
				this.spectators.forEach(spec => spec.socket.emit("endgame", {state: 1})); // State 1 : end
				var winnername = players[winner] ? players[winner].name || "Anonymous" : "?";
				var losername = players[1-winner] ? players[1-winner].name || "Anonymous" : "?";
				console.log("Game " + this.room + " ended | " + winnername + " won over " + losername);
				console.log("Generated " + (creditsW + creditsL) + " credits");
			}

			try {
				this.game.init(players[0], players[1]);
				this.game.timed = true;
				this.game.start();
				this.date = Date.now();
			} catch (e) {
				console.log(e);
				this.finish();
				this.broadcast("endgame", {state: 6, credit: 0}); // State 6 : internal error
				console.log("Game " + this.room + " ended by internal error");
				console.log("Generated 0 credits");
			}
			var hero1 = this.game.areas[0].hero ? this.game.areas[0].hero.nameCard : "?";
			var hero2 = this.game.areas[1].hero ? this.game.areas[1].hero.nameCard : "?";
			console.log("Started game " + this.room + " | " + players[0].name + " (" + hero1 + ") vs " + players[1].name + " (" + hero2 + ")");
			this.private = true;
			this.start();
		}
	}

	command (socket, cmd) {

		var no = this.players.findIndex(p => p.socket === socket);
		if (no >= 0) {
			try {
				this.game.command(cmd, no);
			} catch (e) {
				console.log(e);
				this.finish();
				var c = 0;
				if (this.players.length > 1 && this.players[0].name !== this.players[1].name) {
					CreditManager.compute(Date.now() - this.room.date, this.game.log.logs.length);
					CreditManager.creditPlayer(this.players[0].name, c);
					CreditManager.creditPlayer(this.players[1].name, c);
				}
				this.players.forEach(p => p.socket.emit("endgame", {state: 6, credit: c})); // State 6 : internal error
				this.spectators.forEach(s => s.socket.emit("endgame", {state: 6}));
				console.log("Game " + this.room + " ended by internal error");
				console.log("Generated " + (c * 2) + " credits");
			}
		}
	}

	chatcommand (socket, text) {

		var items = text.split(' ');
		var cmd = items[0];

		switch (cmd) {
		case "reveal": {
			var p = this.players.find(p => p.socket === socket);
			if (!p || items.length > 1) {
				var no = this.players.findIndex(p => p.socket === socket);
				var other = this.players.find(p => p.socket.name && p.socket.name === items[1]);
				if (!other)
					other = this.spectators.find(p => p.socket.name && p.socket.name === items[1]);
				if (other && other !== p && (!other.access || !other.access.some(e => e === no))) {
					this.whispers[no].forEach(w => {
						other.socket.emit("notification", w);
					})
					other.socket.emit("info", { type: "access", access: no});
					other.access = other.access || [];
					other.access.push(no);
					socket.emit("chat", { type: "info", info: 1 });
				} else
					socket.emit("chat", { type: "info", info: 2 });
			} else
				socket.emit("chat", { type: "info", info: 2 });
			break;
		}
		default: socket.emit("chat", { type: "info", info: 0 });
		}
	}

	chat (socket, text) {

		if (socket.name){
			this.broadcast("chat", { type: "text", from: socket.name, text });
			return;
		}

		if (this.players.find(p => p.socket === socket)) {
			this.players.forEach(p => p.socket.emit("chat", { type: "text", from: p.socket === socket ? 0 : 1, text }));
			var no = this.players[0].socket === socket ? 2 : 3;
			this.spectators.forEach(s => s.socket.emit("chat", { type: "text", from: no, text }));
		} else {
			this.players.forEach(p => p.socket.emit("chat", { type: "text", from: 4, text }));
			this.spectators.forEach(s => s.socket.emit("chat", { type: "text", from: s.socket === socket ? 0 : 4, text }));
		}
	}

	kick (socket) {

		this.spectators = this.spectators.filter(p => p.socket !== socket);
		if (this.players.every(p => p.socket !== socket))
			return;
		var same = this.players.length > 1 && this.players[0].name === this.players[1].name;
		var pdis = this.players.find(p => p.socket === socket);
		var name = pdis ? pdis.name : "Anonymous";
		this.players = this.players.filter(p => p.socket !== socket);
		if (this.started && !this.finished && this.players.length <= 1) {
			this.finish();
			var c = 0;
			if (this.players.length > 0 && !same) {
				c = Math.floor(CreditManager.compute(Date.now() - this.date, this.game.log.logs.length, false) * 2.5);
				CreditManager.creditPlayer(this.players[0].name, c);
			}
			this.players.forEach(p => p.socket.emit("endgame", {state: 5, credit: c})); // State 5 : connection lost
			this.spectators.forEach(s => s.socket.emit("endgame", {state: 5}));
			console.log("Game " + this.room + " ended | Connection with " + name + " lost");
			console.log("Generated " + c + " credits");
		}
	}
}

module.exports = RoomManager;