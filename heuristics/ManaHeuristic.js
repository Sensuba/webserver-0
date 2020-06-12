
var Heuristic = require("./Heuristic");

class ManaHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 3;
		this.egoism = 0.3;
	}

	evaluate () {

		return this.area.manapool.receptacles.length;
	}
}

module.exports = ManaHeuristic;