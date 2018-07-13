
class Tile {

	constructor (id, field) {

		this.id = { type: "tile", "no": id };

		this.field = field;

		this.card = null;
	}

	isEmpty () {

		return this.card === null || this.card === undefined;
	}

	place (card) {

		if (this.card !== null)
			this.card.destroy();
		this.card = card;
		if (card.location !== this)
			card.move(this);
	}

	free() {

		var c = this.card;
		this.card = null;
		if (c !== null && c.location === this)
			c.move(null);
	}

	addCard (card) {

		this.place(card);
	}

	removeCard (card) {

		if (this.card === card)
			this.free ();
	}

	hasCard (card) {

		return this.card === card;
	}
}

module.exports = Tile;