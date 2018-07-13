var Deck = require("./Deck");
var Card = require("./Card");
var Field = require("./Field");

class Area {

	constructor (id, decklist, gameboard) {

		this.id = { type: "area", "no": id };

		this.gameboard = gameboard;
		this.deck = new Deck(decklist.body, this);
		this.field = new Field(this);
		this.field.tiles[6].place(new Card(decklist.hero, gameboard.getCardId()));
		console.log(this.field.tiles[6].card);
	}

	opposite () {

		return this.gameboard.areas[1 - this.id];
	}
}

module.exports = Area;