const targets = {

	tile: (src, target) => true,
	emptyTile: (src, target) => target.isEmpty,
	entity: (src, target) => target.occupied && target.card.isType("entity")
};

class Event {

	constructor (action, requirement) {

		this.action = action;
		this.requirement = requirement;
	}

	execute (target) {

		if (!this.requirement || this.requirement(target))
			this.action(target);
	}

	static get target () {

		return target;
	}
}

module.exports = Event;