var Deck = require("./Deck");
var Card = require("./Card");
var Field = require("./Field");
var Hand = require("./Hand");

class Area {

	constructor (id, decklist, gameboard) {

		this.id = { type: "area", no: id };

		this.gameboard = gameboard;
		this.deck = new Deck(decklist.body, this);
		this.field = new Field(this);
		this.hand = new Hand(this);
		new Card(decklist.hero, gameboard.getCardId(), this.field.tiles[6]);
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw (n = 1) {

		if (n <= 0) return;
		this.deck.draw().goto(this.hand);
		if (n > 1)
			this.draw(n-1);
	}

	get isPlaying () {

		return this.gameboard.currentArea = this;
	}

	newTurn () {

		this.draw();
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}
}

module.exports = Area;