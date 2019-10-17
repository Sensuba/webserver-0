var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Cemetery = require("./Cemetery");
var Update = require("./Update");
var Action = require("./Action");
var Mutation = require("./Mutation");
var Reader = require("./Blueprint/Reader");

class Card {

	constructor (model, board, location) {

		this.id = { type: "card", no: board.registerCard(this) };
		this.model = model;
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
		delete copy.parent;
		delete copy.passives;
		delete copy.tokens;
		delete copy.mutations;
		delete copy.mutatedState;
		delete copy.mutdata;
		copy.model = this.model.idCardmodel;
		return copy;
	}

	summon (tile) {

		if (this.onBoard && this.chp !== undefined && this.chp <= 0)
			this.resetBody();
		this.skillPt = 1;
		this.chp = this.eff.hp;
		this.goto(tile, true);
		if (this.isType("character"))
			this.resetSickness();
		this.activate();
		this.gameboard.notify("summon", this, tile);
	}

	goto (loc) {

		if (this.location === loc)
			return;

		var former = this.location;
		this.location = loc;
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || loc.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		this.identify();
		if (this.area)
			this.gameboard.notify("cardmove", this, loc);
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
	}

	/*loadModel () {

		return Bank.get(this.model);
	}*/

	resetBody () {

		//var model = this.loadModel();
		var model = this.model;
		for (var k in model)
			this[k] = model[k];
		delete this.supercode;
		this.events = [];
		this.faculties = [];
		this.passives = [];
		this.mutations = [];
		this.states = {};
		this.clearBoardInstance();
		if (this.isType("hero")) {
			this.level = 1;
			this.faculties.push(new Action(new Event(() => this.area.manapool.createReceptacle())));
		}
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.mana && typeof this.mana === 'string')
			this.mana = parseInt(this.mana, 10);
		if (this.atk && typeof this.atk === 'string')
			this.atk = parseInt(this.atk, 10);
		if (this.hp && typeof this.hp === 'string')
			this.hp = parseInt(this.hp, 10);
		if (this.range && typeof this.range === 'string')
			this.range = parseInt(this.range, 10);
	}

	levelUp () {

		if (!this.isType("hero"))
			return;
		
		this.level++;
		var lv = this.level === 2 ? this.lv2 : this.lvmax;
		if (!lv) {
			this.level--;
			return;
		}

		this.atk = lv.atk;
		this.range = lv.range;
		this.overload = lv.overload;
		this.blueprint = lv.blueprint;
		this.events = [];
		this.passives = [];
		this.faculties = [new Action(new Event(() => this.area.manapool.createReceptacle()))];
		this.mutations = [];
		this.states = {};
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.atk && typeof this.atk === 'string')
			this.atk = parseInt(this.atk, 10);
		if (this.range && typeof this.range === 'string')
			this.range = parseInt(this.range, 10);
		this.gameboard.notify("levelup", this);
		this.events.forEach(event => {
			if (!event.requirement)
				event.execute(this.gameboard, this)
		});
	}

	freeze () {

		this.states.frozen = true;
		this.frozenTimer = false;
		this.gameboard.notify("charfreeze", this);
	}

	get frozen () {

		return this.states && this.states.frozen ? true : false;
	}

	destroy () {

		this.clearBoardInstance();
		this.gameboard.notify("destroycard", this);
		if (this.isType("hero"))
			this.gameboard.heroDies(this.area.id.no);
		if (!this.onBoard || this.chp)
			return;
		if (this.area)
			this.goto(this.area.cemetery);
		else this.location = null;
	}

	damage (dmg, src) {

		if (!this.chp || dmg <= 0)
			return;
		if (this.hasState("immune"))
			return;

		if (this.hasShield) {
			this.breakShield();
			return;
		}

		this.chp -= dmg;
		this.gameboard.notify("damagecard", this, dmg, src);
		if (this.chp <= 0 || (!this.isType("hero") && src.hasState("lethal")))
			new Update(() => this.destroy(), this.gameboard);
	}

	heal (amt, src) {

		if (!this.chp || amt <= 0)
			return;

		this.chp = Math.min(this.eff.hp, this.chp + amt);
		this.gameboard.notify("healcard", this, amt, src);
	}

	boost (atk, hp, range) {

		if (!atk && !hp && !range)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp >= 0)
			this.chp += hp;
		else
			this.chp = Math.min(this.chp, this.eff.hp);
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

	silence () {

		this.faculties = [];
		this.passives = [];
		this.mutations = [];
		this.events = [];
		this.states = {};
		this.shield = false;
		delete this.blueprint;
		this.mana = parseInt(this.model.mana, 10);
		this.atk = parseInt(this.model.atk, 10);
		this.hp = parseInt(this.model.hp, 10);
		this.chp = Math.min(this.eff.hp, this.chp);
		this.breakShield();
		this.gameboard.notify("silence", this);
	}

	pushBack () {

		if (!this.onBoard)
			return;
		var back = this.location.tilesBehind.filter(t => t.isEmpty);
		if (back.length <= 0)
			return;
		this.goto(back[Math.floor(Math.random() * back.length)]);
	}

	pushForward () {

		if (!this.onBoard)
			return;
		var forward = this.location.tilesAhead.filter(t => t.isEmpty);
		if (forward.length <= 0)
			return;
		this.goto(forward[Math.floor(Math.random() * forward.length)]);
	}

	addShield () {

		if (this.shield)
			return;
		this.shield = true;
		this.gameboard.notify("addshield", this);
	}

	breakShield () {

		if (!this.shield)
			return;
		this.shield = false;
		this.gameboard.notify("breakshield", this);
	}

	get hasShield () {

		return this.shield ? true : false;
	}

	get canAct () {

		var eff = this.eff;

		if (!this.onBoard)
			return false;
		if (eff.frozen)
			return false;
		if (eff.motionPt)
			return true;
		if ((eff.actionPt || (this.hasState("fury") && eff.strikes === 1)) && (!eff.firstTurn || this.hasState("rush")))
			return true;

		return false;
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || eff.frozen || eff.atk <= 0 || eff.range <= 0)
			return false;
		if (eff.firstTurn && !this.hasState("rush"))
			return false;
		if (!eff.actionPt && (!this.hasState("fury") || eff.strikes !== 1))
			return false;

		var needed = 1;
		if (this.location.inBack)
			needed++;
		if (target.isCovered(this.hasState("flying")))
			needed++;
		if (!this.hasState("flying") && target.hasState("flying"))
			needed++;

		return eff.range >= needed;
	}

	attack (target) {

		if (!this.hasState("fury") || this.strikes !== 1)
			this.actionPt--;
		this.strikes++;
		this.motionPt = 0;
		this.gameboard.notify("charattack", this, target);
		target.damage(this.eff.atk, this);
		if (!this.hasState("initiative"))
			target.ripost(this);
		this.gameboard.update();
	}

	ripost (other) {

		if (this.isType("figure") && this.eff.atk > 0)
			other.damage(this.eff.atk, this);
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

		return this.states && this.eff.states[state] ? true : false;
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

		return (this.mana || this.eff.mana === 0) && this.area && this.eff.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;
		if (!targets || targets.length === 0)
			return false;

		return targets.every((t, i) => this.targets[i](this, t));
	}

	get targets () {

		var targets = [];
		if (this.isType("entity"))
			targets.push(Event.targets.friendlyEmpty);
		/*if (this.blueprint && this.blueprint.triggers && this.blueprint.triggers.some(trigger => trigger.target)) {
			var filter = this.blueprint.triggers.find(trigger => trigger.target).in[0];
			targets.push((src, target) => !filter || (target.occupied && target.card.isType(filter)));
		}*/
		this.events.forEach(e => {
			if (e.requirement) 
				targets.push(e.requirement);
		});
		return targets;
	}

	cover (other, flying = false) {

		if (!this.isType("character") || !this.onBoard || !other.onBoard)
			return false;
		return (other.location.isBehind(this.location) || (this.hasState("cover neighbors") && other.location.isNeighborTo(this.location))) && flying === this.hasState("flying");
	}

	get covered () {

		return this.isCovered();
	}

	isCovered (flying = false) {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this, flying));
	}

	play (targets) {

		this.area.manapool.use(this.eff.mana);
		switch(this.cardType) {
		case "figure":
			this.summon(targets[0]);
			this.gameboard.notify("playcard", this, targets[0], targets[1]);
			this.events.forEach(event => {
				if (!event.requirement || targets.length > 1)
					event.execute(this.gameboard, this, targets.length > 1 ? targets[1] : undefined)
			});
			break;
		case "spell":
			this.goto(this.area.court);
			this.gameboard.notify("playcard", this, targets ? targets[0] : undefined);
			this.events.forEach(event => event.execute(this.gameboard, this, targets ? targets[0] : undefined));
			this.destroy();
			break;
		default: break;
		}
		this.gameboard.update();
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt || this.frozen || tile.occupied || this.hasState("static"))
			return false;
		return this.location.isAdjacentTo(tile);
	}

	canUse (faculty, target) {

		return faculty.canBeUsed(this, target);
	}

	use (index, target) {

		this.gameboard.notify("cardfaculty", this, { type: "boolean", value: this.faculties[index] instanceof Action }, target ? target.id : undefined);
		this.faculties[index].execute(this.gameboard, this, target);
	}

	setState (state, value) {

		this.states[state] = value;
		this.gameboard.notify("setstate", this, { type: "string", value: state }, { type: "boolean", value: value });
	}

	move (tile) {

		this.motionPt--;
		this.gameboard.notify("charmove", this, tile);
		this.goto(tile);
		this.gameboard.update();
	}

	setPoints (action, skill, motion) {

		this.actionPt = action;
		this.skillPt = skill;
		this.motionPt = motion;
		this.gameboard.notify("setpoints", this, { type: "int", value: action }, { type: "int", value: skill }, { type: "int", value: motion });
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
			if (this.frozen)
				this.frozenTimer = true;
		}
	}

	mutate (effect, end) {

		var mut = new Mutation(effect);
		mut.attach(this);
		if (end)
			var unsub = end((t,s,d) => {
				mut.detach();
				unsub();
			});
	}

	activate () {

		this.activated = true;
		this.passives.forEach(passive => passive.activate());
	}

	deactivate () {

		this.activated = false;
		this.passives.forEach(passive => passive.deactivate());
	}

	get eff () {

		if (this.isEff)
			return this;
		if (!this.mutatedState)
			this.update();
		return this.mutatedState;
	}

	update () {

		if (this.isEff)
			return;
		var res;
		res = Object.assign({}, this);
		res.isEff = true;
		res.states = Object.assign({}, this.states);
		res = this.mutations.reduce((card, mut) => mut.apply(card), res);
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});

		this.mutatedState = res;
	}

	/*get eff () {

		if (this.computing)
			return this;
		this.computing = true;
		var res;
		if (this.isEff)
			res = this;
		else {
			res = Object.assign({}, this);
			res.isEff = true;
			res.states = Object.assign({}, this.states);
			res = this.mutations.reduce((card, mut) => mut(card), res);
		}
		this.computing = false;

		return res;
	}

	update () {}*/

	clearBoardInstance () {

		delete this.chp;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
		this.deactivate();
	}
}

module.exports = Card;