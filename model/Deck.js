var Card = require("./Card");

class Deck {

	constructor (list, area) {

		this.id = { type: "deck", no: area.id.no };

		this.locationOrder = 1;

		this.area = area;

		this.cards = [];
		list.forEach(el => new Card(el, this.area.gameboard, this));
		this.shuffle();
	}

	draw(filter) {

		if (this.cards.length <= 0)
			return;

		if (!filter)
			return this.cards[0];
		return this.cards.find(filter);
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

	get isEmpty () {

		return this.count === 0;
	}

	get opposite () {

		return this.area.opposite.deck;
	}

	get public () {

		return false;
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

module.exports = Deck;