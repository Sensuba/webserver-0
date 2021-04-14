var Faculty = require("./Faculty");

class Action extends Faculty {

	constructor (event, text) {

		super(event, src => {
			src.actionPt--;
			src.motionPt = 0;
			if (src.furyState === 1)
				src.furyState = 0;
		}, text);
	}

	canBeUsed (src, target) {

		return src.actionPt > 0 && !src.firstTurn && !src.frozen && (!this.event.requirement || this.event.requirement(src, target));
	}

	copy () {

		return new Action (this.event, this.text);
	}
}

module.exports = Action;