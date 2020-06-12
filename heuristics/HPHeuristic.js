
var Heuristic = require("./Heuristic");

class HPHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 1500;
		this.egoism = 0;
	}

	evaluate () {

		return this.area.hero.chp;
	}
}

module.exports = HPHeuristic;