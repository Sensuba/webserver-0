var Bank = require("../Bank");
var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Cemetery = require("./Cemetery");
var Update = require("./Update");
var Action = require("./Action");
var Reader = require("./Blueprint/Reader");

class Card {

	constructor (noModel, board, location) {

		this.id = { type: "card", no: board.registerCard(this) };
		this.model = noModel;
		this.gameboard = board;

		this.location = location;
		this.resetBody();

		this.location = null;
		this.identified = [false, false];
		if (location) {
			this.gameboard.notify("newcard", this, location);
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

		return this.location instanceof Cemetery;
	}

	get damaged() {

		return this.hp && this.chp && this.chp < this.hp;
	}

	get data() {

		var copy = Object.assign({}, this);
		delete copy.location;
		delete copy.gameboard;
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
		this.gameboard.notify("summon", this, tile);
	}

	goto (loc) {

		if (this.location === loc)
			return;

		var former = this.location;
		this.location = loc;
		if (this.area)
			this.gameboard.notify("cardmove", this, loc);
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

	loadModel () {

		return Bank.get(this.model);
	}

	resetBody () {

		var model = this.loadModel();
		for (var k in model)
			this[k] = model[k];
		delete this.supercode;
		this.events = [];
		this.faculties = [];
		this.mutations = [];
		this.states = {};
		this.clearBoardInstance();
		if (this.isType("hero"))
			this.faculties.push(new Action(new Event(() => this.area.manapool.createReceptacle())));
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.atk && typeof this.atk === 'string')
			this.atk = parseInt(this.atk, 10);
		if (this.hp && typeof this.hp === 'string')
			this.hp = parseInt(this.hp, 10);
		if (this.range && typeof this.range === 'string')
			this.range = parseInt(this.range, 10);
	}

	destroy () {

		this.gameboard.notify("destroycard", this);
		this.clearBoardInstance();
		if (this.area)
			this.goto(this.area.cemetery);
		else this.location = null;
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;

		this.chp -= dmg;
		this.gameboard.notify("damagecard", this, dmg, src);
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		this.chp = Math.min(this.hp, this.chp + amt);
		this.gameboard.notify("healcard", this.id, amt, src);
	}

	boost (atk, hp, range) {

		if (!atk && !hp && !range)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp >= 0)
			this.chp += hp;
		else
			this.chp = Math.min(this.chp, this.hp);
		this.range += range;
		this.gameboard.notify("boostcard", this, atk, hp, range);
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	set (cost, atk, hp, range) {

		if (cost || cost === 0)
			this.mana = cost;
		if (atk || atk === 0)
			this.atk = atk;
		if (hp || hp === 0) {
			this.hp = hp;
			this.chp = hp;
		}
		if (range || range === 0)
			this.range = range;
		this.gameboard.notify("setcard", this, cost, atk, hp, range);
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	get canAct () {

		if (!this.onBoard)
			return false;
		if (this.motionPt)
			return true;
		if ((this.actionPt || (this.hasState("fury") && this.strikes === 1)) && (!this.firstTurn || this.hasState("rush")))
			return true;

		return false;
	}

	canAttack (target) {

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area)
			return false;
		if (this.firstTurn && !this.hasState("rush"))
			return false;
		if (!this.actionPt && (!this.hasState("fury") || this.strikes !== 1))
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.covered)
			needed++;

		return this.range >= needed;
	}

	attack (target) {

		if (!this.hasState("fury") || this.strikes !== 1)
			this.actionPt--;
		this.strikes++;
		this.motionPt = 0;
		target.damage(this.atk, this);
		if (!this.hasState("initiative"))
			target.ripost(this);
		this.gameboard.notify("charattack", this, target);
		this.gameboard.update();
	}

	ripost (other) {

		if (this.isType("figure") && this.atk > 0)
			other.damage(this.atk, this);
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

	hasState (state) {

		return this.states && this.states[state];
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

		return (this.mana || this.mana === 0) && this.area && this.mana <= this.area.manapool.usableMana;
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
		this.gameboard.notify("playcard", this, targets ? targets[0] : undefined);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			this.events.forEach(event => event.execute(this.gameboard, targets.length > 1 ? targets[1] : undefined));
			break;
		case "spell":
			this.goto(this.area.court);
			this.events.forEach(event => event.execute(this.gameboard, targets ? targets[0] : undefined));
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

	canUse (faculty) {

		return faculty.canBeUsed(this);
	}

	use (index) {

		this.gameboard.notify("cardfaculty", this, { type: "boolean", value: this.faculties[index] instanceof Action });
		this.faculties[index].execute(this.gameboard, this);
	}

	move (tile) {

		this.motionPt--;
		this.gameboard.notify("charmove", this, tile);
		this.goto(tile);
	}

	attach (mutation, end) {


	}

	resetSickness () {

		this.actionPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
		this.strikes = 0;
	}

	refresh () {

		this.skillPt = 1;
		if (this.isType("character")) {
			this.actionPt = 1;
			this.motionPt = 1;
			this.firstTurn = false;
			this.strikes = 0;
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