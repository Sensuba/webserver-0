var Faculty = require("./Faculty");

class Action extends Faculty {

	constructor (event) {

		super(event, src => src.actionPt--);
	}

	canBeUsed (src) {

		return src.actionPt > 0;
	}
}

module.exports = Action;