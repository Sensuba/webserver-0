
class Court {

	constructor (area) {

		this.id = { type: "court", no: area.id.no };

		this.locationOrder = 3;

		this.area = area;

		this.card = null;
	}

	get isEmpty () {

		return this.card === null || this.card === undefined;
	}

	get occupied () {

		return !this.isEmpty;
	}

	get public () {

		return true;
	}

	get cards () {

		return this.card ? [this.card] : [];
	}

	place (card) {

		if (this.card !== null)
			this.card.destroy();
		this.card = card;
		if (card.location !== this)
			card.goto(this);
	}

	free() {

		var c = this.card;
		this.card = null;
		if (c !== null && c.location === this)
			c.goto(null);
	}

	addCard (card) {

		card.identify();
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

module.exports = Court;