var AI = require("./AI");
var Script = require("../mission/Script");

class ScriptedAI extends AI {

	constructor (gameboard, no) {

		super(gameboard, no);
	}

	act () {

		return { type: "endturn" };
	}
}

module.exports = ScriptedAI;