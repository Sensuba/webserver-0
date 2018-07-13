var Bank = require("../../Bank");

class Card {

	constructor (noModel, noId, location) {

		this.id = { type: "card", no: noId };

		Object.assign(this, Bank.get(noModel));

		this.location = null;
		if (location)
			this.goto(location);
	}

	goto (loc) {

		var former = this.location;
		if (this.location !== null && this.location.hasCard (this))
			location.removeCard (this);
		this.location = loc;
		/*if (former is Cemetery || (former is Tile && (value is Hand || value is Deck)))
			ResetBody ();*/
		if (loc !== null && !loc.hasCard (this))
			loc.addCard (this);
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}

	destroy () {

		this.goto(null);
	}

	isType (type) {

		return this.cardType === type;
	}

	isArchetype (arc) {

		return this.archetypes && this.archetypes.includes(arc);
	}
}

module.exports = Card;