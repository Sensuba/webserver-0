var Faculty = require("./Faculty");

class Action extends Faculty {

	constructor (event) {

		super(event, src => src.actionPt--);
	}

	canBeUsed (src, target) {

		return src.actionPt > 0 && (!this.event.requirement || this.event.requirement(src, target));
	}
}

module.exports = Action;