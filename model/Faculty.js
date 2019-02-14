class Faculty {

	constructor (event, cost) {

		this.event = event;
		this.cost = cost;
	}

	execute (gameboard, src, target) {

		this.cost(src);
		this.event.execute(gameboard, src, target);
	}
}

module.exports = Faculty;