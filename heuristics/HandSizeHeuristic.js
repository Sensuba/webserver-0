
var Heuristic = require("./Heuristic");

class HandSizeHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 2.5;
		this.egoism = 0;
	}

	evaluate () {

		var value = this.area.hand.count;
		if (value >= 10)
			value = 8;
		return value;
	}
}

module.exports = HandSizeHeuristic;