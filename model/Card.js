var Bank = require("../Bank");
var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Update = require("./Update");
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
			if (this.onBoard) {
				this.skillPt = 1;
				this.chp = this.hp;
				if (this.isType("character"))
					this.resetSickness();
			}
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
		this.gameboard.notify("summon", this.id, tile.id);
	}

	goto (loc) {

		if (this.location === loc)
			return;

		var former = this.location;
		this.location = loc;
		if (this.area)
			this.gameboard.notify("cardmove", this.id, loc.id);
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

		this.gameboard.notify("destroycard", this.id);
		this.clearBoardInstance();
		this.goto(null);
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.gameboard.notify("damagecard", this.id, dmg, src.id);
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard); //this.destroy();
	}

	canAttack (target) {

		if (this.firstTurn || !this.actionPt || !this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area)
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.covered)
			needed++;

		return this.range >= needed;
	}

	attack (target) {

		this.actionPt--;
		this.motionPt = 0;
		target.damage(this.atk, this);
		target.ripost(this);
		this.gameboard.notify("charattack", this.id, target.id);
		this.gameboard.update();
	}

	ripost (other) {

		if (this.isType("figure") && this.atk > 0)
			other.damage(this.atk, this);
	}

	get area () {

		return this.location ? this.location.area : null;
	}

	get gameboard () {

		return this.location ? this.location.area.gameboard : null;
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
				this.gameboard.whisper("identify", id, this.id, this.data);
				this.identified[id] = true;
			}
		});
	}

	get canBePaid () {

		return this.mana && this.area && this.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.canBePaid)
			return false;
		if (this.targets.length === 0)
			return true;
		if (targets.length === 0)
			return false;

		return targets.every((t, i) => this.targets[i](this, t));
	}

	get targets () {

		var targets = [];
		if (this.isType("entity"))
			targets.push(Event.targets.friendlyEmpty);
		if (this.blueprint && this.blueprint.triggers && this.blueprint.triggers.some(trigger => trigger.target)) {
			var filter = this.blueprint.triggers.find(trigger => trigger.target).in[0];
			targets.push((src, target) => !filter || (target.occupied && target.card.isType(filter)));
		}
		return targets;
	}

	cover (other) {

		if (!this.isType("character") || !this.onBoard || !other.onBoard)
			return false;
		return other.location.isBehind(this.location);
	}

	get covered () {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this));
	}

	play (targets) {

		this.area.manapool.use(this.mana);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			if (this.event && targets.length > 1)
				this.event.execute(this.gameboard, targets ? targets[1] : undefined);
			break;
		case "spell":
			this.goto(this.area.court);
			if (this.event)
				this.event.execute(this.gameboard, targets ? targets[0] : undefined);
			this.destroy();
			break;
		default: break;
		}
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt)
			return;
		return this.location.isAdjacentTo(tile);
	}

	move (tile) {

		this.motionPt--;
		this.gameboard.notify("charmove", this.id, tile.id);
		this.goto(tile);
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