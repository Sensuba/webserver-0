var Card = require("./Card");
var Bank = require("../Bank");

const CURSE_DAMAGE = 500;
const CURSE_INC = 100;

class Deck {

	constructor (area) {

		this.id = { type: "deck", no: area.id.no };

		this.locationOrder = 1;

		this.area = area;
		this.cards = [];
		this.curse = CURSE_DAMAGE;
	}

	init (list, shuffle = true) {

		this.cards = [];
		if (!shuffle)
			this.shufflelock = true;
		list.forEach(el => new Card(Bank.get(el), this.area.gameboard, this));
		delete this.shufflelock;
	}

	draw(filter) {

		if (this.cards.length <= 0) {
			if (filter)
				return;
			this.fatigue();
		}

		if (!filter)
			return this.cards[0];
		return this.cards.find(filter);
	}

	fatigue() {

		this.area.gameboard.notify("fatigue", this);
		this.area.hero.damage(this.curse, null);
		this.curse += CURSE_INC;
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

	addCard (card, index) {

		this.cards.splice(index || (this.shufflelock ? this.count : Math.floor(Math.random() * (this.count+1))), 0, card);
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