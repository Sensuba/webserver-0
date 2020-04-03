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
		player.token = token;
		player.deck = deck;
		player.ready = true;

		if (!this.started && this.players.length === 2 && this.players.every(p => p.ready)) { // Ready to start

			this.game.send = (type, src, data) => this.broadcast("notification", {type, src, data});
			this.game.whisper = (type, no, src, ...data) => players[no] ? players[no].socket.emit("notification", {type, src, data}) : {};
			this.game.explain = (type, src, data) => {
				if (this.spectators)
					this.spectators.forEach(s => s.socket.emit("notification", {type, src, data}));
			}
			this.game.end = (winner) => {
				
				this.game.ended = true;

				var creditsW = 0, creditsL = 0;
				if (players[winner].name !== players[1-winner].name) {
					var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length, false)
					if (players[winner].name) creditsW = Math.floor(c * 2.5);
					if (players[1-winner].name) creditsL = Math.floor(c);
					CreditManager.creditPlayer(players[winner].name, creditsW);
					CreditManager.creditPlayer(players[1-winner].name, creditsL);
				}

				if (players[winner])
					players[winner].socket.emit("endgame", {state: 3, credit: creditsW}); // State 3 : win
				if (players[1-winner])
					players[1-winner].socket.emit("endgame", {state: 4, credit: creditsL}); // State 4 : lose
				this.spectators.forEach(spec => spec.socket.emit("endgame", {state: 1})); // State 1 : end
				console.log("Game " + this.room + " ended normally");
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
			console.log("Started game " + this.room);
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
				var c = CreditManager.compute(Date.now() - this.room.date, this.game.log.logs.length);
				CreditManager.creditPlayer(this.players[0].name, c);
				CreditManager.creditPlayer(this.players[1].name, c);
				this.players.forEach(p => p.socket.emit("endgame", {state: 6, credit: c})); // State 6 : internal error
				this.spectators.forEach(s => s.socket.emit("endgame", {state: 6}));
				console.log("Game " + this.room + " ended by internal error");
				console.log("Generated " + (c * 2) + " credits");
			}
		}
	}

	kick (socket) {

		this.spectators = this.spectators.filter(p => p.socket !== socket);
		if (this.players.every(p => p.socket !== socket))
			return;
		this.players = this.players.filter(p => p.socket !== socket);
		if (this.started && !this.finished && this.players.length <= 1) {
			this.finish();
			var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length);
			CreditManager.creditPlayer(this.players[0].name, c);
			this.players.forEach(p => p.socket.emit("endgame", {state: 5, credit: c})); // State 5 : connection lost
			this.spectators.forEach(s => s.socket.emit("endgame", {state: 5}));
			console.log("Game " + this.room + " ended by connection lost");
			console.log("Generated " + c + " credits");
		}
	}
}

module.exports = RoomManager;