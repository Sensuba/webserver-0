var Card = require("./Card");

const MAX_CARDS = 10;

class Hand {

	constructor (area) {

		this.id = { type: "hand", no: area.id.no };

		this.locationOrder = 2;
		this.public = false;

		this.area = area;

		this.cards = [];
	}

	shuffle() {

	    for (let i = this.cards.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
	    }
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

		return this.area.opposite.hand;
	}

	addCard (card) {

		if (this.count >= MAX_CARDS && !this.hasCard(card))
			this.discard(card);
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

	discard (card) {
		
		card.discard();
	}
}

module.exports = Hand;