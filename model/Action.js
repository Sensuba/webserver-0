var Faculty = require("./Faculty");

class Action extends Faculty {

	constructor (event) {

		super(event, src => {
			src.actionPt--;
			src.motionPt = 0;
		});
	}

	canBeUsed (src, target) {

		return src.actionPt > 0 && !src.firstTurn && !src.frozen && (!this.event.requirement || this.event.requirement(src, target));
	}
}

module.exports = Action;