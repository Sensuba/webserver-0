
var Heuristic = require("./Heuristic");

class GemHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 1;
		this.egoism = 0.15;
	}

	evaluate () {

		return this.area.manapool.gems;
	}
}

module.exports = GemHeuristic;