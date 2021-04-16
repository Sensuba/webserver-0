var Manager = require("./Manager");
var CreditManager = require("./CreditManager");
var DeckAnalyst = require("./DeckAnalyst");
var Script = require("./mission/Script");
var ScriptedAI = require("./ScriptedAI");

class MissionManager extends Manager {

	constructor (mission) {

		super("mission");
		this.mission = mission;
	}

	init (user) {

		this.user = user;
		this.script = new Script(this.mission);
		this.ai = new ScriptedAI(this.game, 1, this.script.data.ai.behaviour);

		this.game.send = (type, src, data) => {
			user.emit("notification", {type, src, data});
			if (type === "newturn" && src.no === 1)
				this.callAI();
		}
		this.game.whisper = (type, no, src, ...data) => no === 0 ? user.emit("notification", {type, src, data}) : {};
		this.game.end = (winner) => {
				
				this.game.ended = true;
				this.user.emit("endgame", {state: winner === 0 ? 3 : 4, credit: 0});
				console.log("Mission for " + (user.name || "Anonymous") + " ended normally");
			}
		
		try {
			this.game.init(
				{ name: user.name, avatar: user.avatar, socket: user.socket, deck: this.script.data.player.deck, props: this.script.data.player.props },
				{ name: this.script.data.ai.name, deck: this.script.data.ai.deck, props: this.script.data.ai.props }
			);
			this.script.rule(this.game);
			this.game.start(this.game.areas[this.script.data.first]);
		} catch (e) {
			console.log(e);
			user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Mission ended by internal error");
		}

		console.log((user.name || "Anonymous") + " started mission " + this.mission.mission + " - " + this.mission.chapter);
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
				this.user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
				console.log("Mission ended by internal error");
			}
		}, 500);
	}

	command (user, cmd) {

		try {
			this.game.command(cmd, 0);
		} catch (e) {
			console.log(e);
			this.finish();
			this.user.emit("endgame", {state: 6, credit: 0}); // State 6 : internal error
			console.log("Mission ended by internal error");
		}
	}

	kick () {

		if (!this.game.ended) {
			this.finish();
			console.log("Mission ended by connection lost");
		}
	}
}

module.exports = MissionManager;