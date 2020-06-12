
var Heuristic = require("./Heuristic");

class HeroLevelHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.type = "linear";
		this.egoism = 0.3;
	}

	evaluate () {

		return (this.area.hero.level - 1) / 2;
	}
}

module.exports = HeroLevelHeuristic;