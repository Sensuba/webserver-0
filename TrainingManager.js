var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");
var TrainingAI = require("./ai/TrainingAI");

class TrainingManager extends Manager {

	constructor () {

		super("training");
	}

	init (socket, name, avatar, deck) {

		this.socket = socket;
		this.ai = new TrainingAI(this.game, 1);

		this.game.send = (type, src, data) => {
			socket.emit("notification", {type, src, data});
			if (type === "newturn" && src.no === 1)
				this.callAI();
		}
		this.game.whisper = (type, no, src, ...data) => no === 0 ? socket.emit("notification", {type, src, data}) : {};
		this.game.end = (winner) => {
				
				this.game.ended = true;
				this.socket.emit("endgame", {state: winner === 0 ? 3 : 4, credit: 0});
				console.log("Training for " + (name || "Anonymous") + " ended normally");
			}
		
		try {
			this.game.init(
				{ name, avatar, socket, deck },
				{ name: "AI", deck: this.ai.deck }
			);
			this.game.start(this.game.areas[Math.floor(Math.random(0, 2))]);
		} catch (e) {
			console.log(e);
			socket.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Training ended by internal error");
		}

		console.log((name || "Anonymous") + " started training");
	}

	callAI () {

		setTimeout(() => {
			try {
				if (this.game.currentArea.id.no === 0 || this.game.ended)
					return;
				this.game.command(this.ai.act(), 1);
				if (this.game.currentArea.id.no === 1)
					this.callAI();
			} catch (e) {
				console.log(e);
				this.finish();
				this.socket.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
				console.log("Training ended by internal error");
			}
		}, 500);
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

		this.finish();
		console.log("Training ended by connection lost");
	}
}

module.exports = TrainingManager;