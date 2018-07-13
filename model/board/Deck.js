var Card = require("./Card");

class Deck {

	constructor (list, area) {

		this.id = { type: "deck", no: area.id.no };

		this.area = area;

		this.cards = [];
		list.forEach(el => new Card(el, this.area.gameboard.getCardId(), this));
		this.shuffle();
	}

	draw() {

		var d = this.cards.pop();
		d.goto(null);
		return d;
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

		return this.area.opposite().deck;
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