var Deck = require("./Deck");
var Card = require("./Card");
var Field = require("./Field");
var Hand = require("./Hand");
var Court = require("./Court");
var Cemetery = require("./Cemetery");
var ManaPool = require("./ManaPool");
var Bank = require('../Bank');

class Area {

	constructor (noId, gameboard) {

		this.id = { type: "area", no: noId };

		this.gameboard = gameboard;
		this.deck = new Deck(this);
		this.field = new Field(this);
		this.hand = new Hand(this);
		this.manapool = new ManaPool(this);
		this.court = new Court(this);
		this.cemetery = new Cemetery(this);
	}

	init (decklist) {

		this.deck.init(decklist.body);
		this.hero = new Card(Bank.get(decklist.hero), this.gameboard, this.field.tiles[6]);
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw (n = 1, filter) {

		if (n <= 0) return;
		var d = this.deck.draw(filter);
		if (d) {
			if (this.hand.isMaxed) {
				this.gameboard.notify("burncard", this, d);
				d.destroy();
			} else {
				d.goto(this.hand);
				this.gameboard.notify("draw", this, d);
			}
		}
		if (n > 1)
			this.draw(n-1, filter);
		this.gameboard.update();
		return d;
	}

	get isPlaying () {

		return this.gameboard.currentArea === this;
	}

	newTurn () {

		this.field.opposite.entities.forEach(e => {
			if (e.frozen && e.frozenTimer)
				e.setState("frozen", false);
		})
		this.gameboard.notify("newturn", this);
		this.manapool.reload();
		this.field.entities.forEach(e => e.refresh());
		this.draw();
		this.gameboard.update();
	}

	endTurn () {

		if (this.isPlaying)
			this.gameboard.newTurn();
	}

	extraTurn () {

		this.extraTurns = (this.extraTurns || 0) + 1;
	}
}

module.exports = Area;