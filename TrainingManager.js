var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");
var TrainingAI = require("./TrainingAI");

class TrainingManager extends Manager {

	constructor (ai) {

		super("training");
		this.deck = ai;
	}

	init (socket, name, avatar, deck) {

		this.socket = socket;
		this.ai = new TrainingAI(this.game, 1, this.deck);

		this.game.send = (type, src, data) => {
			socket.emit("notification", {type, src, data});
			if (type === "newturn" && src.no === 1)
				setTimeout(() => this.callAI(), 50);
		}
		this.game.whisper = (type, no, src, ...data) => no === 0 ? socket.emit("notification", {type, src, data}) : {};
		this.game.end = (winner) => {
				
				this.game.ended = true;
				var c = CreditManager.compute(Date.now() - this.date, this.game.log.logs.length);
				CreditManager.creditPlayer(name, c);
				this.socket.emit("endgame", {state: winner === 0 ? 3 : 4, credit: c});
				console.log("Training for " + (name || "Anonymous") + " ended normally");
			}
		
		try {
			this.game.init(
				{ name, avatar, socket, deck },
				{ name: "AI", deck: this.ai.deck }
			);
			this.game.start();
			this.date = Date.now();
		} catch (e) {
			console.log(e);
			socket.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Training ended by internal error");
		}

		console.log((name || "Anonymous") + " started training");
	}

	callAI () {

		if (this.game.currentArea.id.no === 0 || this.game.ended)
			return;
		this.ai.act(cmd => {
			try {
			//console.log(cmd);
				this.game.command(cmd, 1);
				if (this.game.currentArea.id.no === 1)
					setTimeout(() => this.callAI(), 50);
			} catch (e) {
				console.log(e);
				this.finish();
				this.socket.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
				console.log("Training ended by internal error");
			}
		})	
	}

	command (socket, cmd) {

		try {
			this.game.command(cmd, 0);
		} catch (e) {
			console.log(e);
			this.finish();
			this.socket.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Training ended by internal error");
		}
	}

	kick () {

		if (!this.game.ended) {
			this.finish();
			console.log("Training ended by connection lost");
		}
	}
}

module.exports = TrainingManager;