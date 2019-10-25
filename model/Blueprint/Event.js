class Event {

	constructor (src, type, condition) {

		this.type = type;
		this.condition = condition;
		this.gameboard = src.gameboard;
	}

	check (t,s,d) {

		return this.type === t && this.condition(t,s,d);
	}

	subscribe (f) {

		return this.gameboard.subscribe(this.type, (t,s,d) => {
			if (this.condition(t,s,d))
				f(t,s,d);
		})
	}
}

module.exports = Event;