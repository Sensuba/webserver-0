
class Choosebox {

	constructor (area) {

		this.id = { type: "choosebox", no: area.id.no };

		this.area = area;

		this.cards = [];
		this.area.gameboard.register(this);
	}

	get firstCard () {

		return this.isEmpty ? null : this.cards[0];
	}

	get lastCard () {

		return this.isEmpty ? null : this.cards[this.count-1];
	}

	get count () {

		return this.cards.length;
	}

	get isEmpty () {

		return this.count === 0;
	}

	get public () {

		return false;
	}

	get opposite () {

		return this.area.opposite.choosebox;
	}

	open (callback) {

		this.opened = true;
		this.callback = callback;
		this.area.gameboard.notify("openchoosebox", this);
	}

	choose (card) {

		if (!this.opened || !this.hasCard(card))
			return;
		this.opened = false;
		if (this.callback)
			this.callback(card);
	}

	chooseAtRandom () {

		this.choose(this.cards[Math.floor(Math.random()*this.count)]);
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

module.exports = Choosebox;