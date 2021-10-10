var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");

class RoomManager extends Manager {

	constructor (room, api, prv = true) {

		super("room");
		this.room = room;
		this.api = api;
		this.private = prv;
		this.players = [];
		this.spectators = [];
	}

	broadcast (e, data) {

		this.players.forEach(p => p.emit(e, data));
		this.spectators.forEach(s => s.emit(e, data));
	}

	join (user) {

		if (!this.started && this.players.length < 2) {
			user.emit('joined', {as: 'player', no: this.players.length});
			this.players.push(user);
			console.log((user.name || "Anonymous") + " joined " + this.room + " as player");
		} else {
			if (this.game && this.game.started) {
				user.emit('joined', {as: 'spectator'});
				this.spectators.push(user);
				this.game.log.logs.forEach(log => {
					var datamap = log.type === "identify" ? log.data : log.data.map(d => d ? d.id || d : d);
					user.emit('notification', {type: log.type, src: log.src.id, data: datamap});
				})
				console.log((user.name || "Anonymous") + " joined " + this.room + " as spectator");
			}
		}
	}

	prepare (player, deck, token) {

		if (!DeckAnalyst.check(deck, token))
			return;

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
					players[no].emit("notification", {type, src, data});
					this.whispers[no].push({type, src, data});
					that.players.forEach(p => {
						if (p.access && p !== players[no] && p.access.some(e => e === no))
							p.emit("notification", {type, src, data});
					});
					that.spectators.forEach(s => {
						if (s.access && s.access.some(e => e === no))
							s.emit("notification", {type, src, data});
					});
				}
			}
			this.game.explain = (type, src, data) => {
				if (this.spectators)
					this.spectators.forEach(s => s.emit("notification", {type, src, data}));
			}
			this.game.end = (winner) => {
				
				if (this.game.ended)
					return;
				this.game.ended = true;

				var share = this.startedprivate || players.some(player => typeof player.deck.hero === "object" || player.deck.body.some(card => typeof card === "object"));

				var creditsW = 0, creditsL = 0;
				if (players.length > 1 && players[winner].name !== players[1-winner].name) {
					var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length, false)
					if (players[winner].name) creditsW = share ? Math.floor(c * 1.65) : Math.floor(c * 2.5);
					if (players[1-winner].name) creditsL = share ? Math.floor(c * 1.65) : Math.floor(c);
					//if (players[winner].bonus) creditsW *= 2;
					//if (players[1-winner].bonus) creditsL *= 2;
					CreditManager.creditPlayer(players[winner].name, creditsW);
					CreditManager.creditPlayer(players[1-winner].name, creditsL);
				}

				if (players[winner])
					players[winner].emit("endgame", {state: 3, credit: creditsW}); // State 3 : win
				if (players[1-winner])
					players[1-winner].emit("endgame", {state: 4, credit: creditsL}); // State 4 : lose
				this.spectators.forEach(spec => spec.emit("endgame", {state: 1})); // State 1 : end
				var winnername = players[winner] ? players[winner].name || "Anonymous" : "?";
				var losername = players[1-winner] ? players[1-winner].name || "Anonymous" : "?";
				this.api.post("/tmp/replay", {idRoom: this.room, log: JSON.stringify(this.game.log.logs.map(log => {
					var nlog = { type: log.type }
					if (log.src)
						nlog.src = log.src.id;
					if (log.data)
						nlog.data = log.data.map(d => d ? d.id || d : d);
					if (nlog.type === "newcard" && nlog.data && log.src.originalData)
						nlog.data.push(log.src.originalData);
					if (log.cmd)
						nlog.cmd = log.cmd;
					return nlog;
				}))})
			    .catch(err => {
			      this.error(error)(err);
			    });
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
			this.startedprivate = this.private;
			this.private = true;
			this.start();
		}
	}

	command (user, cmd) {

		var no = this.players.findIndex(p => p === user);
		if (no >= 0) {
			try {
				this.game.command(cmd, no);
			} catch (e) {
				console.log(e);
				this.finish();
				var c = 0;
				if (this.players.length > 1 && this.players[0].name !== this.players[1].name) {
					c = CreditManager.compute(Date.now() - this.room.date, this.game.log.logs.length);
					CreditManager.creditPlayer(this.players[0].name, c + (this.players[0].bonus ? c : 0));
					CreditManager.creditPlayer(this.players[1].name, c + (this.players[1].bonus ? c : 0));
				}
				this.players.forEach(p => p.emit("endgame", {state: 6, credit: c + (p.bonus ? c : 0)})); // State 6 : internal error
				this.spectators.forEach(s => s.emit("endgame", {state: 6}));
				console.log("Game " + this.room + " ended by internal error");
				console.log("Generated " + (c * 2) + " credits");
			}
		}
	}

	chatcommand (user, text) {

		var items = text.split(' ');
		var cmd = items[0];

		switch (cmd) {
		case "reveal": {
			var p = this.players.find(p => p === user);
			if (!p || items.length > 1) {
				var no = this.players.findIndex(p => p === user);
				var other = this.players.find(p => p.name && p.name === items[1]);
				if (!other)
					other = this.spectators.find(p => p.name && p.name === items[1]);
				if (other && other !== p && (!other.access || !other.access.some(e => e === no))) {
					this.whispers[no].forEach(w => {
						other.emit("notification", w);
					})
					other.emit("info", { type: "access", access: no});
					other.access = other.access || [];
					other.access.push(no);
					user.emit("chat", { type: "info", info: 1 });
				} else
					user.emit("chat", { type: "info", info: 2 });
			} else
				user.emit("chat", { type: "info", info: 2 });
			break;
		} 
		default: user.emit("chat", { type: "info", info: 0 });
		}
	}

	chat (user, text) {

		if (user.name){
			this.broadcast("chat", { type: "text", from: user.name, text });
			return;
		}

		if (this.players.find(p => p === user)) {
			this.players.forEach(p => p.emit("chat", { type: "text", from: p === user ? 0 : 1, text }));
			var no = this.players[0] === user ? 2 : 3;
			this.spectators.forEach(s => s.emit("chat", { type: "text", from: no, text }));
		} else {
			this.players.forEach(p => p.emit("chat", { type: "text", from: 4, text }));
			this.spectators.forEach(s => s.emit("chat", { type: "text", from: s === user ? 0 : 4, text }));
		}
	}

	kick (user) {

		this.spectators = this.spectators.filter(p => p !== user);
		if (this.players.every(p => p !== user))
			return;
		var same = this.players.length > 1 && this.players[0].name === this.players[1].name;
		var pdis = this.players.find(p => p === user);
		var name = pdis ? pdis.name : "Anonymous";
		this.players = this.players.filter(p => p !== user);
		if (this.started && !this.finished && this.players.length <= 1) {
			this.finish();
			var c = 0;
			if (this.players.length > 0 && !same) {
				c = Math.floor(CreditManager.compute(Date.now() - this.date, this.game.log.logs.length, false) * (this.private ? 1.65 : 2.5));
				//if (this.players[0].bonus) c *= 2;
				CreditManager.creditPlayer(this.players[0].name, c);
			}
			this.players.forEach(p => p.emit("endgame", {state: 7, credit: c})); // State 7 : connection lost with a player
			this.spectators.forEach(s => s.emit("endgame", {state: 7}));
			console.log("Game " + this.room + " ended | Connection with " + name + " lost");
			console.log("Generated " + c + " credits");
		}
	}
}

module.exports = RoomManager;