var Bank = require("../Bank");
var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Reader = require("./Blueprint/Reader");

class Card {

	constructor (noModel, board, location) {

		this.id = { type: "card", no: board.registerCard(this) };
		this.model = noModel;

		this.resetBody();

		this.location = null;
		this.identified = [false, false];
		if (location) {
			location.area.gameboard.notify("newcard", this.id, location.id);
			this.goto(location);
		}
	}

	get inHand() {

		return this.location instanceof Hand;
	}

	get inDeck() {

		return this.location instanceof Deck;
	}

	get onBoard() {

		return this.location instanceof Tile;
	}

	get destroyed() {

		return this.location === null;
	}

	get damaged() {

		return this.hp && this.chp && this.chp < this.hp;
	}

	get data() {

		var copy = Object.assign({}, this);
		delete copy.location;
		return copy;
	}

	summon (tile) {

		if (tile.occupied || tile.card === this)
			return;
		this.skillPt = 1;
		this.chp = this.hp;
		this.goto(tile, true);
		if (this.isType("character"))
			this.resetSickness();
		this.area.gameboard.notify("summon", this.id, tile.id);
	}

	goto (loc) {

		if (this.location === loc)
			return;

		var former = this.location;
		this.location = loc;
		if (this.area)
			this.area.gameboard.notify("cardmove", this.id, loc.id);
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || loc.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		this.identify();
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}

	resetBody () {

		var model = Bank.get(this.model);
		for (var k in model)
			this[k] = model[k];
		delete this.supercode;
		this.clearBoardInstance();
		if (this.blueprint)
			Reader.read(this.blueprint, this);
	}

	destroy () {

		this.area.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		this.goto(null);
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.area.gameboard.notify("damagecard", this.id, dmg, src.id);
		if (this.chp <= 0)
			this.destroy();
	}

	get area () {

		return this.location ? this.location.area : null;
	}

	isType (type) {

		switch (type) {
		case "entity": return this.isType("character") || this.isType("artifact");
		case "character" : return this.isType("hero") || this.isType("figure");
		default: return this.cardType === type;
		}
	}

	isArchetype (arc) {

		return this.archetypes && this.archetypes.includes(arc);
	}

	identify () {

		if (!this.location || this.identified[0] && this.identified[1])
			return;
		[0, 1].forEach(id => {
			if (this.identified[id])
				return;
			if (this.location.public || this.location.area.id.no === id) {
				this.area.gameboard.whisper("identify", id, this.id, this.data);
				this.identified[id] = true;
			}
		});
	}

	get canBePaid () {

		return this.mana && this.area && this.mana <= this.area.manapool.usableMana;
	}

	play (targets) {

		this.area.manapool.use(this.mana);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(targets ? targets[0] : undefined);
			this.destroy();
			break;
		default: break;
		}
	}

	resetSickness () {

		this.actionPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
	}

	refresh () {

		this.skillPt = 1;
		if (this.isType("character")) {
			this.actionPt = 1;
			this.motionPt = 1;
			this.firstTurn = false;
		}
	}

	clearBoardInstance () {

		delete this.chp;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
	}
}

module.exports = Card;