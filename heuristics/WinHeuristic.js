
var Heuristic = require("./Heuristic");

class WinHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.type = "linear";
		this.egoism = 0;
	}

	evaluate () {

		return this.area.opposite.hero.destroyed || this.area.opposite.hero.isGhost ? 1 : 0;
	}
}

module.exports = WinHeuristic;