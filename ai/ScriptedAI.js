var AI = require("./AI");
var Reader = require("./script/Reader");

class ScriptedAI extends AI {

	constructor (gameboard, no, behaviour) {

		super(gameboard, no);
		this.reader = new Reader(gameboard, no, behaviour);
		this.reader.init();
	}

	act () {

		return this.reader.next() || { type: "endturn" };
	}
}

module.exports = ScriptedAI;