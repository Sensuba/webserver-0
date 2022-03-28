var Deck = require("./Deck");
var Card = require("./Card");
var Field = require("./Field");
var Hand = require("./Hand");
var Court = require("./Court");
var HonorBoard = require("./HonorBoard");
var Cemetery = require("./Cemetery");
var Discard = require("./Discard");
var Capsule = require("./Capsule");
var Nether = require("./Nether");
var Choosebox = require("./Choosebox");
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
		this.honorboard = new HonorBoard(this);
		this.cemetery = new Cemetery(this);
		this.discard = new Discard(this);
		this.capsule = new Capsule(this);
		this.nether = new Nether(this);
		this.choosebox = new Choosebox(this);
		this.extraTurns = [];
		this.gameboard.register(this);
	}

	init (decklist, props) {

		this.deck.init(decklist.body, props ? props.shuffle : true);
		this.hero = new Card(Bank.get(decklist.hero), this.gameboard, this.field.tiles[6]);
		if (props) {
			this.startingHand = props.startingHand;
			this.startingGem = props.startingGem;
		}
	}

	get opposite () {

		return this.gameboard.areas[1 - this.id.no];
	}

	draw (n = 1, filter) {

		if (n <= 0) return;
		var d = this.deck.draw(filter);
		if (d) {
			if (this.hand.isMaxed) {
				d.discard();
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

	newTurn (callback) {

		this.startingTurn = true;
		this.field.tiles.forEach(t => {
			if (t.hasHazards("wind"))
				t.clearHazards("wind");
			if (t.hasHazards("shadow"))
				t.clearHazards("shadow");
		})
		this.manapool.reload();
		this.gameboard.update();
		this.field.cards.forEach(e => e.refresh());
		if (callback)
			callback();
		this.gameboard.notify("newturn", this);
		this.draw();
		this.gameboard.update();
		delete this.startingTurn;
		if (this.hasToEnd) {
			delete this.hasToEnd;
			this.endTurn();
		}
	}

	endTurn () {

		if (!this.isPlaying)
			return;

		if (this.startingTurn) {
			this.hasToEnd = true;
			return;
		}

		while (this.choosebox.opened)
			this.choosebox.chooseAtRandom();
		this.gameboard.notify("endturn", this);
		this.gameboard.update();

		this.field.entities.forEach(e => {
			if (e.frozen && e.frozenTimer)
				e.setState("frozen", false);
			if (e.poisoned)
				e.triggerPoison();
		})
		this.field.opposite.entities.forEach(e => {
			if (e.poisoned)
				e.triggerPoison();
		})

		this.hand.cards.filter(c => c.hasState("temporary")).forEach(c => c.discard());
		this.gameboard.notify("cleanup", this);
		this.gameboard.newTurn();
	}

	extraTurn (callback) {

		this.extraTurns.push(callback);
		this.gameboard.notify("extraturn", this);
	}
}

module.exports = Area;