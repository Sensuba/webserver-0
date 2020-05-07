class Faculty {

	constructor (event, cost, text) {

		this.event = event;
		this.cost = cost;
		this.text = text;
	}

	execute (gameboard, src, target) {

		this.cost(src);
		this.event.execute(gameboard, src, target);
	}
}

module.exports = Faculty;