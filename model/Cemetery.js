
class Cemetery {

	constructor (area) {

		this.id = { type: "cemetery", no: area.id.no };

		this.locationOrder = 4;

		this.area = area;

		this.cards = [];
		this.area.gameboard.register(this);
	}

	get count () {

		return this.cards.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	get public () {

		return true;
	}

	get opposite () {

		return this.area.opposite.cemetery;
	}

	addCard (card) {

		this.cards.push(card);
		if (card.location !== this)
				card.goto(this);

	}

	removeCard (card) {

		if (this.cards.includes (card)) {
			this.cards = this.cards.filter (el => el !== card);
			if (card !== null && card.location === this)
				card.goto(null);
		}
	}

	hasCard (card) {

		return this.cards.includes (card);
	}
}

module.exports = Cemetery;