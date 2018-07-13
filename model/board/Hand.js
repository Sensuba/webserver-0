var Card = require("./Card");

class Hand {

	constructor (area) {

		this.id = { type: "hand", no: area.id.no };

		this.area = area;

		this.cards = [];
	}

	shuffle() {

	    for (let i = this.cards.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
	    }
	}

	count () {

		return this.cards.length;
	}

	isEmpty () {

		return this.count() === 0;
	}

	opposite () {

		return this.area.opposite().hand;
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

module.exports = Hand;