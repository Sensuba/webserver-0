var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");
var TrainingAI = require("./TrainingAI");

class TrainingManager extends Manager {

	constructor (ai, call) {

		super("training");
		this.deck = ai;
		this.call = call;
	}

	init (user, deck) {

		this.user = user;
		this.ai = new TrainingAI(this.game, 1, this.deck, this.call);
		this.name = user.name;

		this.game.send = (type, src, data) => {
			user.emit("notification", {type, src, data});
			if (type === "newturn" && src.no === 1)
				setTimeout(() => this.callAI(), 50);
		}
		this.game.whisper = (type, no, src, ...data) => no === 0 ? user.emit("notification", {type, src, data}) : {};
		this.game.end = (winner) => {
				
				this.game.ended = true;
				var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length);
				CreditManager.creditPlayer(name, c);
				this.user.emit("endgame", {state: winner === 0 ? 3 : 4, credit: c});
				console.log("Training for " + (name || "Anonymous") + " ended normally");
				console.log("Generated " + c + " credits");
			}
		
		try {
			this.game.init(
				{ name: user.name, avatar: user.avatar, socket: user.socket, deck },
				{ name: "AI", deck: this.ai.deck }
			);
			this.game.start();
			this.date = Date.now();
		} catch (e) {
			console.log(e);
			user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Training for " + (this.name || "Anonymous") + " ended by internal error");
		}

		var hero1 = this.game.areas[0].hero ? this.game.areas[0].hero.nameCard : "?";
		var hero2 = this.game.areas[1].hero ? this.game.areas[1].hero.nameCard : "?";
		console.log("Started training | " + (name || "Anonymous") + " (" + hero1 + ") vs CPU (" + hero2 + ")");
	}

	callAI () {

		if (this.game.currentArea.id.no === 0 || this.game.ended)
			return;
		this.ai.act(cmd => {
			try {
			console.log(cmd);
				this.game.command(cmd, 1);
				if (this.game.currentArea.id.no === 1)
					setTimeout(() => this.callAI(), 50);
			} catch (e) {
				console.log(e);
				this.finish();
				this.user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
				console.log("Training for " + (this.name || "Anonymous") + " ended by internal error");
			}
		})	
	}

	command (user, cmd) {

		try {
			this.game.command(cmd, 0);
		} catch (e) {
			console.log(e);
			this.finish();
			this.user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Training for " + (this.name || "Anonymous") + " ended by internal error");
		}
	}

	kick () {

		if (!this.game.ended) {
			this.finish();
			console.log("Training for " + (this.name || "Anonymous") + " ended by connection lost");
		}
	}
}

module.exports = TrainingManager;