var Bank = require("../../Bank");

class Card {

	constructor (noModel, noId) {

		this.id = { type: "card", "no": noId };

		this.body = Bank.get(noModel);

		this.location = null;
	}

	move (loc) {

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

		this.move(null)
	}
}

module.exports = Card;