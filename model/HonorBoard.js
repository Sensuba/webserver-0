
const MAX_CARDS = 2;

class HonorBoard {

	constructor (area) {

		this.id = { type: "honorboard", no: area.id.no };

		this.locationOrder = 3;
		this.public = true;

		this.area = area;

		this.cards = [];
		this.area.gameboard.register(this);
}

	get count () {

		return this.cards.length;
	}

	get isMaxed () {

		return this.count >= MAX_CARDS;
	}

	get isEmpty () {

		return this.count === 0;
	}

	get opposite () {

		return this.area.opposite.capsule;
	}

	addCard (card) {

		if (this.count >= MAX_CARDS && !this.hasCard(card))
			this.destroy(card);
		else {
			this.cards.push(card);
			if (card.location !== this)
				card.goto(this);
		}

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

module.exports = HonorBoard;