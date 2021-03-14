class Event {

	constructor (src, type, condition) {

		this.type = type;
		this.condition = condition;
		this.gameboard = src.gameboard;
	}

	check (t,s,d) {

		return this.getTypes().includes(t) && this.condition(t,s,d);
	}

	subscribe (f) {

		var unsubs = [];
		this.getTypes().forEach(type =>
			unsubs.push(this.gameboard.subscribe(type, (t,s,d) => {
				if (this.condition(t,s,d))
					f(t,s,d);
		})))

		return () => unsubs.forEach(unsub => unsub());
	}

	getTypes () {

		switch (this.type) {
		case "cast": return ["playcard", "trap"];
		default: return [this.type];
		}
	}
}

module.exports = Event;