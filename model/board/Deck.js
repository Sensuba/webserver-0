var Card = require("./Card");

class Deck {

	constructor (list, area) {

		this.id = { type: "deck", "no": area.id.no };

		this.area = area;

		this.list = [];
		list.forEach(el => this.list.push(new Card(el, this.area.gameboard.getCardId())));
		this.shuffle();
	}

	draw() {

		return this.list.pop();
	}

	shuffle() {

	    for (let i = this.list.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.list[i], this.list[j]] = [this.list[j], this.list[i]];
	    }
	}

	count () {

		return this.list.length;
	}

	isEmpty () {

		return this.count() === 0;
	}

	opposite () {

		return this.area.opposite.deck;
	}
}

module.exports = Deck;