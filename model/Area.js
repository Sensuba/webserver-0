var Deck = require("./Deck");
var Card = require("./Card");
var Field = require("./Field");
var Hand = require("./Hand");
var Court = require("./Court");
var ManaPool = require("./ManaPool");

class Area {

	constructor (noId, decklist, gameboard) {

		this.id = { type: "area", no: noId };

		this.gameboard = gameboard;
		this.deck = new Deck(decklist.body, this);
		this.field = new Field(this);
		this.hand = new Hand(this);
		this.manapool = new ManaPool(this);
		this.court = new Court(this);
		new Card(decklist.hero, gameboard, this.field.tiles[6]);
		
		this.manapool.createReceptacle();
		this.manapool.createReceptacle();
		this.manapool.createReceptacle();
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw (n = 1) {

		if (n <= 0) return;
		var d = this.deck.draw();
		d.goto(this.hand);
		this.gameboard.notify("draw", this.id, d.id);
		if (n > 1)
			this.draw(n-1);
	}

	get isPlaying () {

		return this.gameboard.currentArea === this;
	}

	newTurn () {

		this.gameboard.notify("newturn", this.id);
		this.manapool.refill();
		this.draw();
		/*if (this.hand.cards[0].isType("figure"))
			this.hand.cards[0].play(this.field.tiles[1]);
		else if (this.hand.cards[1].isType("figure"))
			this.hand.cards[1].play(this.field.tiles[1]);*/
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}
}

module.exports = Area;