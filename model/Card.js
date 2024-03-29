var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Court = require("./Court");
var HonorBoard = require("./HonorBoard");
var Cemetery = require("./Cemetery");
var Discard = require("./Discard");
var Update = require("./Update");
var Action = require("./Action");
var Skill = require("./Skill");
var ArtifactSkill = require("./ArtifactSkill");
var Mutation = require("./Mutation");
var Reader = require("./Blueprint/Reader");

const MAX_RANGE = 3;
 
class Card {

	constructor (model, board, location, nullify) {

		if (nullify)
			return;
		this.id = { type: "card", no: board ? board.registerCard(this) : -1 };
		if (board)
			board.register(this);
		this.equals = other => other.id && this.id.type === other.id.type && this.id.no === other.id.no;
		this.model = model;
		this.gameboard = board;

		this.location = location;
		this.resetBody();

		this.location = null;
		this.identified = [false, false];
		this.originalData = this.data;
		if (location) {
			this.gameboard.notify("newcard", this, location);
			this.goto(location);
			if (this.isType("hero") && this.onBoard) {
				this.skillPt = 1;
				this.chp = this.hp;
				this.activate();
				this.resetSickness();
			} else if (this.isType("seal") && this.location instanceof HonorBoard)
				this.activate();
		}
	}

	get inHand() {

		return this.location instanceof Hand;
	}

	get inDeck() {

		return this.location && this.location.id.type === "deck";
	}

	get onBoard() {

		return this.location instanceof Tile;
	}

	get destroyed() {

		return this.location instanceof Cemetery || this.location instanceof Discard;
	}

	get isGhost() {

		return this.onBoard && (this.chp <= 0 || this.dying || this.goingtodie);
	}

	get damaged() {

		if (!this.isType("character"))
			return false;
		return this.hp && this.chp && this.chp < this.eff.hp;
	}

	get data() {

		var copy = Object.assign({}, this);
		delete copy.location;
		delete copy.gameboard;
		delete copy.passives;
		delete copy.innereffects;
		delete copy.tokens;
		delete copy.mutations;
		delete copy.cmutations;
		delete copy.pmutations;
		delete copy.oncontact;
		delete copy.mutatedState;
		delete copy.mutdata;
		delete copy.php;
		delete copy.dying;
		delete copy.pOrder;
		delete copy.lOrder;
		delete copy.playedFrom;
		delete copy.stopShifting;
		delete copy.goingtodie;
		delete copy.variables;
		delete copy.countered;
		delete copy.retarget;
		delete copy.secretcount;
		delete copy.secretparam;
		delete copy.secreteffect;
		delete copy.originalData;
		copy.lastwill = this.innereffects && this.innereffects.some(ie => ie.type === "lw");
		copy.model = this.model.idCardmodel;
		var genParent = a => {
			if (a.parent) {
				if (a.parent.parent)
					return { parent: genParent(a.parent), notoken: a.parent.notoken };
				else return a.parent.idCardmodel;
			}
		}
		if (copy.pilot)
			copy.pilot = copy.pilot.data;
		if (copy.parent)
			copy.parent = genParent(copy);
		return copy;
	}

	summon (tile) {

		if (this.dying)
			this.resetBody();
		this.lb = this.eff.overload && this.eff.ol && this.eff.ol >= this.eff.overload ? Math.floor(this.eff.ol/this.eff.overload) : 0;
		this.skillPt = 1;
		let chp = this.eff.hp;
		this.goto(tile, true);
		this.chp = chp;
		this.php = { hp: this.hp, chp: this.chp }
		this.resetSickness();
		this.activate();
		this.gameboard.notify("summon", this, tile);
		tile.applyHazards(this);
		this.gameboard.update();
	}

	goto (loc) {

		if (this.location === loc)
			return;
		var former = this.location, pilot = null;

		if (this.onBoard && loc instanceof Tile && loc.occupied) {
			let swapcard = loc.card;
			loc.card = null;
			this.goto(loc);
			swapcard.goto(former);
			return;
		}

		delete this.dying;
		if (loc instanceof Court && this.overload)
			this.lb = this.eff.overload && this.eff.ol && this.eff.ol >= this.eff.overload ? Math.floor(this.eff.ol/this.eff.overload) : 0;

		this.location = loc;
		if (former instanceof Tile && !(loc instanceof Tile || loc instanceof Court) && this.activated) {
			this.deactivate();
			if (this.pilot) {
				pilot = this.pilot;
				delete this.pilot;
			}
		}
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || former.locationOrder === 0))
			this.resetBody ();
		else if (former && former.locationOrder && (loc.locationOrder === null || loc.locationOrder === undefined))
			this.lOrder = former.locationOrder;
		else if ((this.lOrder !== null && this.lOrder !== undefined) && (former.locationOrder === null || former.locationOrder === undefined) && (loc === null || this.lOrder > loc.locationOrder || this.lOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		if ((loc instanceof Tile || loc instanceof HonorBoard) && !this.pOrder)
			this.gameboard.registerCardOrder(this);
		if ((loc instanceof Tile || loc instanceof HonorBoard) && !(former instanceof Tile) && !this.activated)
			this.activate();
		if (former instanceof Tile && loc instanceof Tile && this.activated && former.area !== loc.area) {
			this.deactivate();
			this.activate();
		}
		if (this.onBoard && former && (former.area === this.area.opposite || former.locationOrder === null || former.locationOrder === undefined)) {
			this.skillPt = 1;
			this.resetSickness();
		}
		if (this.onBoard && this.isType("secret")) {
			var secrets = this.innereffects.filter(e => e.type === "secret");
			if (!this.area || !this.area.isPlaying)
				this.secretparam = 0;
			if (secrets.length >= 1)
				this.secreteffect = secrets[0];
		}
		this.identify();
		if (this.area && loc.hasCard(this)) {
			this.gameboard.notify("cardmove", this, loc, former);
			if (this.onBoard && (!this.isType("character") || this.chp))
				loc.applyHazards(this);
			if (this.onBoard && this.isType("secret"))
				this.gameboard.notify("secretsetup", this, loc);
		}
		if (pilot)
			this.ejectPilot(pilot, former);
		/*if (former != null && !destroyed)
			Notify ("card.move", former, value);
		if (location is Tile)
			lastTileOn = location as Tile;*/
		this.gameboard.update();
	}

	/*loadModel () {

		return Bank.get(this.model);
	}*/

	resetBody () {

		//var model = this.loadModel();
		if (this.hasState("bonus")) {
			this.setState("bonus", false);
			if (this.stopShifting)
				this.stopShifting();
		}
		
		let wasActivated = this.activated;
		if (this.passives)
			this.passives.forEach(passive => passive.deactivate());
		if (this.activated)
			this.deactivate();
		if (this.identified && (this.inHand || this.inDeck))
			this.identified[this.area.opposite.id.no] = false;
		var model = this.model;
		for (var k in model) {
			this[k] = model[k];
			if (typeof this[k] === 'string' && !isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		this.originalMana = this.mana;
		this.originalAtk = this.atk;
		this.originalHp = this.hp;
		this.originalRange = this.range;
		delete this.supercode;
		delete this.mutatedState;
		delete this.mutdata;
		if (!this.onBoard)
			delete this.pOrder;
		this.ol = 0;
		this.events = [];
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		this.clearMutations();
		this.cmutations = [];
		this.pmutations = [];
		this.states = {};
		this.shield = false;
		delete this.poisondmg;
		delete this.armor;
		delete this.silenced;
		this.dying = false;
		delete this.variables;
		delete this.charges;
		delete this.countered;
		delete this.lOrder;
		delete this.finalMana;
		delete this.finalOverload;
		delete this.retarget;
		delete this.secretcount;
		delete this.secretparam;
		delete this.secreteffect;
		delete this.goingtodie;
		delete this.steps;
		delete this.activationPt;
		delete this.activated;
		if (!model.blueprint)
			delete this.blueprint;
		this.clearBoardInstance();
		if (wasActivated)
			this.activate();
		if (this.isType("hero")) {
			this.level = 1;
			this.faculties.push(new Action(new Event(() => this.area.manapool.createReceptacle())));
			this.lv1 = {
				blueprint: this.blueprint,
				description: this.description,
				atk: this.atk,
				range: this.range,
				overload: this.overload
			}
		}
		if (this.mecha && this.isType("artifact")) {
			this.faculties.push(new Skill(new Event(() => { this.setPoints(this.actionPt, this.skillPt+1, this.motionPt); this.chargeMech(1); }), 1));
			this.faculties.push(new ArtifactSkill(new Event((src, target) => { this.setPoints(this.actionPt, this.skillPt+1, this.motionPt); src.loadPilot(target.card); }, (src, target) => src.pilot ? false : (src.area === target.area && target.occupied && target.card.isType("figure") && !target.card.mecha && !target.card.outOfMecha), true), 0));
		}
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.isType("artifact") || this.isType("secret"))
			this.faculties.push(new ArtifactSkill(new Event(() => new Update(() => this.destroy(), this.gameboard)), 0));
	}

	levelUp (level) {

		if (!this.isType("hero"))
			return;
		var originallevel = this.level;
		if (!level)
			level = this.level + 1;
		if (level === this.level)
			return;
		var down = level < this.level;
		this.level = level;
		var lv = this.level === 1 ? this.lv1 : (this.level === 2 ? this.lv2 : this.lvmax);
		if (!lv) {
			this.level = originallevel;
			return;
		}

		this.deactivate();
		this.ol = 0;
		this.atk = lv.atk;
		this.range = lv.range;
		this.overload = lv.overload;
		this.blueprint = lv.blueprint;
		this.events = [];
		this.passives = [];
		this.innereffects = [];
		this.faculties = [new Action(new Event(() => this.area.manapool.createReceptacle()))];
		this.clearMutations();
		this.cmutations = [];
		this.pmutations = [];
		this.states = {};
		delete this.armor;
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.scripts)
			this.scripts.forEach(event => Reader.read(event, this));
		if (this.atk && typeof this.atk === 'string')
			this.atk = parseInt(this.atk, 10);
		if (this.range && typeof this.range === 'string')
			this.range = parseInt(this.range, 10);
		this.gameboard.notify("levelup", this, { type: "bool", value: down });
		this.events.forEach(event => {
			if (!event.requirement)
				event.execute(this.gameboard, this)
		});
		this.activate();
		this.gameboard.update();
	}

	levelDown () {

		if (!this.isType("hero"))
			return;
		if (this.level === 0)
			return;
		this.levelUp(this.level - 1);
	}

	freeze () {

		if (this.hasState("frozen"))
			return;
		this.states.frozen = true;
		this.frozenTimer = false;
		this.update();
		this.gameboard.notify("charfreeze", this);
	}

	get frozen () {

		return this.states && this.hasState("frozen") ? true : false;
	}

	get exalted () {

		return this.states && this.hasState("exaltation") ? true : false;
	}

	get concealed () {

		return this.states && this.hasState("concealed") ? true : false;
	}

	get immune () {

		return this.states && this.hasState("immune") ? true : false;
	}

	targetableBy (other) {

		return !this.exalted && !((this.area && other.area && this.area !== other.area) && (this.concealed || this.immune));
	}

	destroy (discard) {

		if (this.destroyed || this.dying)
			return;
		if (this.inDeck) {
			this.reveal();
			this.gameboard.notify("burncard", this.area, this);
			this.anihilate();
			return;
		}
		this.dying = true;
		let onboard = this.onBoard;
		let pilot = this.pilot;
		let location = this.location;
		this.gameboard.notify(discard ? "discardcard" : "destroycard", this, { type: "boolean", value: onboard });
		if (pilot && onboard) 
			this.ejectPilot(pilot, location);
		if (!this.dying)
			return;
		this.clearBoardInstance();
		if (this.isType("hero"))
			this.gameboard.heroDies(this.area.id.no);
		if (!this.dying)
			return;
		if (this.area)
			this.goto(discard ? this.area.discard : this.area.cemetery);
		else this.location = null;
	}

	discard () {

		this.destroy(true);
	}

	anihilate () {

		this.goto(this.area.nether);
	}

	damage (dmg, src, discret) {

		if (!this.chp || dmg <= 0 || this.isGhost)
			return;
		if (this.hasState("immune"))
			return;

		if (this.hasShield) {
			this.breakShield();
			return;
		}
		if (this.hasState("immortal") && dmg >= this.chp) {
			dmg = this.chp - 1;
			if (dmg <= 0)
				return;
		}

		this.chp -= dmg;
		let overkill = this.chp <= 0 ? -this.chp : 0, overkilln = () => {};
		var okn = [];
		if (src && src.hasState("piercing") && overkill && this.location.tilesBehind.some(t => t.occupied && t.card.isType("entity"))) {
			okn = this.location.tilesBehind.filter(t => t.occupied && t.card.isType("entity")).map(t => t.card.damage(overkill, src, true));
			overkilln = () => { okn.forEach(n => { if(n) n(); }) }
		}
		var damagen = () => {

			this.gameboard.notify("damagecard", this, dmg, src, overkill);
			overkilln();
			if (src && src.hasState("lifelink"))
				src.area.hero.heal(dmg, src);
		}
		let wascomputing = this.computing;
		this.computing = true;
		if (!discret)
			damagen();
		if (this.chp <= 0 || (this.isType("figure") && src && src.hasState("lethal"))) {
			this.goingtodie = true;
			new Update(() => { if (this.goingtodie) this.destroy(); }, this.gameboard);
		}
		this.computing = wascomputing;
		if (discret)
			return () => damagen();
	}

	poison (psn) {


		if (!this.chp || psn <= 0 || this.isGhost)
			return;
		if (this.hasState("immune") || this.hasState("vaccinated"))
			return;

		this.poisondmg = (this.poisondmg || 0) + psn;
		this.gameboard.notify("poisoncard", this, psn);
		this.gameboard.update();
	}

	get poisoned () {

		return this.poisondmg && this.poisondmg > 0;
	}

	curePoison (value) {

		if (value < 0 || !this.poisoned)
			return;
		if (value === null || value === undefined || value > this.poisondmg)
			value = this.poisondmg;

		this.poisondmg -= value;
		this.gameboard.notify("curepoison", this, value);
		this.gameboard.update();
	}

	triggerPoison () {

		this.gameboard.notify("poisontrigger", this, this.poisondmg);
		this.damage(this.poisondmg, null);
	}

	charge (charge) {

		this.gameboard.notify("charge", this, charge);
		this.charges = Math.min(5, Math.max(0, (this.charges || 0) + charge));
		this.gameboard.update();
	}

	heal (amt, src) {

		if (amt === null || amt === undefined)
			amt = this.eff.hp - this.chp;
		if (!this.chp || amt <= 0 || this.isGhost)
			return;

		if (!this.isType("artifact") && src.hasState("corruption")) {
			this.damage(amt, src && this.area === src.area ? null : src);
			return;
		}

		let love = 0;
		if (this.isType("artifact"))
			this.chp += amt;
		else {
			if (this.hasState("love"))
				love = Math.max(0, this.chp + amt - this.eff.hp);
			amt = Math.max(0, Math.min(amt, this.eff.hp - this.chp));
			this.chp += amt;
		}
		if (amt > 0)
			this.gameboard.notify("healcard", this, amt, src);
		if (love > 0)
			this.boost(0, love, 0);
	}

	boost (atk, hp, range) {

		if (this.range >= MAX_RANGE && range > 0)
			range = null;
		if (!atk && !hp && !range || this.isGhost)
			return;

		this.atk += atk;
		this.hp += hp;
		if (hp < 0 && this.chp && !this.isType("artifact"))
			this.chp += hp;
		this.range = Math.min(this.range + range, MAX_RANGE);
		this.gameboard.notify("boostcard", this, atk, hp, range);
		this.update();
		if (hp < 0 && this.chp && !this.isType("artifact"))
			this.chp = Math.min(this.chp, this.eff.hp);
	}

	changeCost (value) {

		if (!value || (value < 0 && this.mana <= 0))
			return;

		if (this.mana + value < 0)
			value = -this.mana;
		this.mana = this.mana + value;
		this.gameboard.notify("changecost", this, value);
	}

	set (cost, atk, hp, range) {

		if (cost || cost === 0) {
			this.mana = cost;
			//this.originalMana = this.mana;
		}
		if (atk || atk === 0) {
			this.atk = atk;
			//this.originalAtk = this.atk;
		}
		if (hp || hp === 0) {
			this.hp = hp;
			if (!isNaN(this.chp))
				this.chp = hp;
			//this.originalHp = this.hp;
			delete this.php;
		}
		if (range || range === 0) {
			this.range = range;
			//this.originalRange = this.range;
		}
		this.gameboard.notify("setcard", this, cost, atk, hp, range);
		this.update();
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	boostoverload (value) {

		if (!value)
			return;

		this.ol += value;
		this.gameboard.notify("overloadcard", this, value);
		this.update();
	}

	silence () {

		this.deactivate();
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		this.clearMutations();
		this.cmutations = [];
		this.pmutations = [];
		this.events = [];
		if (this.hasState("glazed"))
			this.states = { glazed: true };
		else this.states = {};
		delete this.poisondmg;
		delete this.armor;
		this.breakShield();
		delete this.blueprint;
		delete this.variables;
		delete this.charges;
		this.mana = this.originalMana;
		this.atk = this.originalAtk;
		this.hp = this.originalHp;
		this.range = this.originalRange;
		this.chp = Math.min(this.eff.hp, this.chp);
		this.activate();
		this.gameboard.notify("silence", this);
	}

	pushBack () {

		if (!this.onBoard || this.hasState("static"))
			return;
		var back = this.location.tilesBehind.filter(t => t.isEmpty);
		if (back.length <= 0)
			return;
		this.goto(back[Math.floor(Math.random() * back.length)]);
	}

	pushForward () {

		if (!this.onBoard || this.hasState("static"))
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

		if (!this.area.isPlaying)
			return false;
		if (!this.onBoard)
			return false;
		if (eff.frozen)
			return false;
		if (eff.canMove)
			return true;
		if ((eff.actionPt || (this.hasState("fury") && eff.furyState === 1)) && (!eff.firstTurn || this.hasState("rush") || this.hasState("agility")))
			return true;

		return false;
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || eff.frozen || target.isType("secret") || eff.atk <= 0 || eff.range <= 0 || target.concealed || this.hasState("static") || this.hasState("passive"))
			return false;
		if (eff.firstTurn && !this.hasState("rush") && !(this.hasState("agility") && !target.isType("hero")))
			return false;
		if (!eff.actionPt && (!this.hasState("fury") || eff.furyState !== 1))
			return false;
		if (eff.firstTurn && this.hasState("rush") && this.hasState("fury") && eff.furyState === 1 && target.isType("hero"))
			return false;
		if (target.isType("hero") && this.hasState("cannot attack heroes"))
			return false;

		return this.canReach(target);
	}

	canReach (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target || !target.onBoard || this.area === target.area || eff.range <= 0 || target.concealed)
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

	attack (target, auto = false) {

		if (!auto && (!this.hasState("fury") || this.furyState !== 1)) {
			this.actionPt--;
			if (this.furyState === 0)
				this.furyState = 1; 
		} else if (!auto && this.hasState("fury") && this.furyState === 1) {
			this.furyState = 2;
		}
		if (!auto)
			this.motionPt = 0;
		if (this.destroyed || this.isGhost || !this.onBoard || target.destroyed || target.isGhost || !target.onBoard) {
			return;
		}
		this.gameboard.notify("charattack", this, target, {type:"bool", value: auto});
		if (this.retarget) {
			target = this.retarget.card;
			delete this.retarget;
		}
		if (this.destroyed || this.isGhost || !this.onBoard || target.destroyed || target.isGhost || !target.onBoard || target === this) {
			this.gameboard.update();
			return;
		}
		this.oncontact = target;
		target.oncontact = this;
		var dmg1 = target.damage(this.eff.atk - (target.eff.armor || 0), this, true);
		var dmgcleave;
		if (this.hasState("cleave"))
			dmgcleave = target.location.neighbors.filter(t => t.occupied && (t.card.isType("figure") || t.card.isType("artifact"))).map(t => t.card.damage(this.eff.atk - (t.card.eff.armor || 0), this, true));
		var dmg2;
		if (!this.eff.states.initiative)
			dmg2 = target.ripost(this);
		if (dmg2) dmg2(); if (dmg1) dmg1(); if (dmgcleave) dmgcleave.forEach(dc => dc());
		this.oncontact = null;
		target.oncontact = null;
		this.gameboard.notify("charcontact", this, target);
		this.gameboard.update();
	}

	ripost (other) {

		var res = () => {};
		if (this.isType("figure") && this.eff.atk > 0)
			res = other.damage(this.eff.atk - (other.eff.armor || 0), this, true);
		return res;
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

		if (arc === "mecha" && this.mecha)
			return true;
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
			var reveal = this.location.public || this.location.area.id.no === id;
			if (this.isType("secret") && this.location.area.id.no !== id && this.onBoard)
				reveal = false;
			if (reveal) {
				this.gameboard.whisper("identify", id, this.id, this.data);
				this.identified[id] = true;
			}
		});
		if (this.identified[0] && this.identified[1] && !this.identified[2]) {
			this.gameboard.notifySpectators("identify", this, this.data);
			this.identified[2] = true;
		}
	}

	reveal () {

		if (this.identified[0] && this.identified[1])
			return;
		[0, 1].forEach(id => {
			if (this.identified[id])
				return;
			this.gameboard.whisper("identify", id, this.id, this.data);
			this.identified[id] = true;
		});
		if (this.identified[0] && this.identified[1] && !this.identified[2]) {
			this.gameboard.notifySpectators("identify", this, this.data);
			this.identified[2] = true;
		}
	}

	get canBePaid () {

		return (!isNaN(this.mana) || this.eff.mana === 0) && this.area && this.eff.mana <= this.area.manapool.usableMana;
	}

	get canBePlayed () {

		if (!this.inHand || !this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;

		return this.gameboard.tiles.some(t => this.canBePlayedOn([t]));
	}

	canBePlayedOn (targets) {

		if (!this.inHand || !this.canBePaid || !this.area.isPlaying)
			return false;
		if (this.targets.length === 0)
			return true;
		if (!targets || targets.length === 0)
			return false;
		if (targets.length > 1 && targets.some((t, i) => targets.indexOf(t) !== i))
			return false;
		return targets.every((t, i) => this.targets[i] && this.targets[i](this, t));
	}

	get targets () {

		var targets = [];
		if (this.isType("entity") || this.isType("secret"))
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

	tryToCover (other, flying = false) {

		if (other.isEff)
			other = other.original;
		if (!this.isType("character") || !this.onBoard || !other.onBoard || this.concealed)
			return false;
		return (other.location.isBehind(this.location) || (this.hasState("cover neighbors") && other.location.isNeighborTo(this.location))) && flying === this.hasState("flying");
	}

	cover (other, flying = false) {

		if (other.isEff)
			other = other.original;
		return this.tryToCover(other, flying) && !other.tryToCover(this, flying);
	}

	get covered () {

		return this.isCovered();
	}

	isCovered (flying = false) {

		if (!this.onBoard)
			return false;
		return this.location.field.entities.some(e => e.cover(this, flying));
	}

	counter () {

		this.countered = true;
	}

	changeTarget (target) {

		this.retarget = target;
	}

	play (targets) {

		this.finalMana = this.eff.mana;
		this.finalOverload = this.eff.ol;
		this.area.manapool.use(this.eff.mana);
		this.playedFrom = { left: this.isLeftRight(true, false), right: this.isLeftRight(false, true) };
		this.setState("temporary", false);
		if (this.hasState("bonus")) {
			this.setState("bonus", false);
			if (this.stopShifting)
				this.stopShifting();
		}
		switch(this.cardType) {
		case "figure":
		case "artifact":
			this.summon(targets[0]);
			let playtargetcard = targets[1] && targets[1].card ? targets[1].card : undefined;
			this.gameboard.notify("playcard", this, targets[0], targets[1], playtargetcard, this.finalMana, this.finalOverload);
			let ftarget = targets.length > 1 ? (this.retarget || targets[1]) : undefined;
			if (ftarget && this.area && ftarget.area && this.area != ftarget.area && ftarget.immune)
				break;
			this.events.forEach(event => {
				if (!event.requirement || targets.length > 1)
					event.execute(this.gameboard, this, ftarget)
			});
			break;
		case "spell":
			this.goto(this.area.court);
			let spelltarget = targets ? targets[0] : undefined;
			let spelltargetcard = spelltarget && spelltarget.card ? spelltarget.card : undefined;
			this.gameboard.notify("playcard", this, undefined, spelltarget, spelltargetcard, this.finalMana, this.finalOverload);
			spelltarget = targets ? (this.retarget || targets[0]) : undefined;
			if (this.countered) {
				this.destroy();
				break;
			}
			let nomoretarget = spelltargetcard && this.area && ((this.area && spelltargetcard.area && spelltargetcard.immune && this.area != spelltargetcard.area) || !spelltargetcard.onBoard) && this.targets[0](this, spelltarget) !== "player";
			if (spelltargetcard && !nomoretarget)
				spelltarget = spelltargetcard.location;
			this.events.forEach(event => {
				if (!event.hasTarget || !nomoretarget)
					event.execute(this.gameboard, this, spelltarget);
			});
			this.destroy();
			break;
		case "secret":
			this.goto(targets[0]);
			this.gameboard.notify("playcard", this, targets[0], undefined, undefined, this.finalMana, this.finalOverload);
			break;
		default: break;
		}
		this.gameboard.update();
		delete this.countered;
		delete this.retarget;
	}

	get canMove () {

		return this.onBoard && this.motionPt && !this.frozen && !this.hasState("static") && this.location.adjacents.some(t => t.isEmpty);
	}

	canMoveOn (tile) {

		if (!this.onBoard || !this.motionPt || this.frozen || tile.occupied || this.hasState("static"))
			return false;
		return this.location.isAdjacentTo(tile);
	}

	canUse (faculty, target) {
		
		if (!this.area.isPlaying)
			return false;
		return faculty.canBeUsed(this, target);
	}

	use (index, target) {

		this.gameboard.notify("cardfaculty", this, { type: "boolean", value: this.faculties[index] instanceof Action }, target ? target.id : undefined, { type: "string", value: this.faculties[index].text });
		this.faculties[index].execute(this.gameboard, this, this.retarget || target);
		delete this.retarget;
	}

	setState (state, value) {

		this.states = this.states || {};
		this.states[state] = value;
		this.gameboard.notify("setstate", this, { type: "string", value: state }, { type: "boolean", value: value });
		this.update();
	}

	move (tile) {

		this.goto(tile);
		this.motionPt--;
		this.gameboard.notify("charmove", this, tile);
		this.gameboard.update();
	}

	setPoints (action, skill, motion) {

		this.actionPt = action;
		this.skillPt = skill;
		this.motionPt = motion;
		this.gameboard.notify("setpoints", this, { type: "int", value: action }, { type: "int", value: skill }, { type: "int", value: motion });
	}

	setVariable (name, value) {

		this.variables = this.variables || {};
		this.variables[name] = value;
		let data = null;
		if (value && typeof value === 'object')
			data = value.id;
		else if (value !== null && value !== undefined)
			data = { type: "int", value: value };
		this.gameboard.notify("storevar", this, { type: "string", value: name }, data);
	}

	getVariable (name) {

		return this.variables ? this.variables[name] : undefined;
	}

	clearVariable (name) {

		if (this.variables) {
			delete this.variables[name];
			this.gameboard.notify("clearvar", this, { type: "string", value: name });
		}
	}

	parameter (option, param) {

		switch (option) {
		case "setcount": this.secretparam = param; break;
		case "seteffect": {
			var secrets = this.innereffects.filter(e => e.type === "secret");
			if (param < secrets.length)
				this.secreteffect = secrets[param];
			break;
		}
		default: break;
		}
	}

	transform (model) {

		this.model = model;
		if (!model.idCardmodel)
			delete this.idCardmodel;
		//var variables = Object.assign({}, this.variables);
		delete this.variables;
		this.resetBody();
		//this.variables = variables;

		if (this.onBoard) {
			this.skillPt = 1;
			this.chp = this.hp;
			this.php = { hp: this.hp, chp: this.chp }
			this.activate();
			this.resetSickness();
		}
		this.gameboard.update();
		this.gameboard.notify("transform", this, {data:this.data});
		if (this.onBoard && this.isType("character") && this.chp)
			this.location.applyHazards(this);
	}

	shift (model, end) {

		if (!(this.inHand || this.inDeck))
			return;

		var data = this.data;
		data.model = this.model;
		this.transform(model);
		this.setState("bonus", true);
		if (end) {
			var unsub = end.subscribe((t,s,d) => {
				for (var k in data) {
					if (k === "id")
						continue;
					this[k] = data[k];
					if (!isNaN(this[k]))
						this[k] = parseFloat(this[k], 10);
				}
				delete this.stopShifting;
				unsub();
				this.gameboard.update();
				this.gameboard.notify("transform", this, {data:this.data});
			});
			this.stopShifting = unsub;
		}
		this.gameboard.update();
	}

	copy (other, glaze) {

		let wasActivated = this.activated;
		if (this.activated)
			this.deactivate();
		var data = other.data;
		for (var k in data) {
			if (k === "id")
				continue;
			this[k] = data[k];
			if (!isNaN(this[k]))
				this[k] = parseFloat(this[k], 10);
		}
		this.model = other.model;
		this.parent = other.parent;

		delete this.pilot;
		this.events = [];
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		other.innereffects.forEach(ie => this.innereffects.push(ie));
		this.clearMutations();
		this.cmutations = [];
		this.pmutations = [];
		this.states = Object.assign({}, other.states);
		this.setState("bonus", false);
		this.variables = Object.assign({}, other.variables);
		this.shield = other.shield;
		this.armor = other.armor;
		this.silenced = other.silenced;
		this.poisondmg = other.poisondmg;
		this.frozenTimer = other.frozenTimer;
		this.identified = [false, false];
		this.silenced = other.silenced;

		if (this.isType("entity")) {
			this.php = other.php;
			if (other.php) {
				this.mutatedState = this.mutatedState || {};
				this.mutatedState.hp = other.php.hp;
				this.mutatedState.chp = other.php.chp;
				this.mutatedState.states = Object.assign({}, this.states);
			}
			this.update();
			this.chp = other.chp;
		}
		if (wasActivated)
			this.activate();
		if (this.mecha && this.isType("artifact")) {
			this.faculties.push(new Skill(new Event(() => { this.setPoints(this.actionPt, this.skillPt+1, this.motionPt); this.chargeMech(1); }), 1));
			this.faculties.push(new ArtifactSkill(new Event((src, target) => { this.setPoints(this.actionPt, this.skillPt+1, this.motionPt); src.loadPilot(target.card); }, (src, target) => src.pilot ? false : (src.area === target.area && target.occupied && target.card.isType("figure") && !target.card.mecha && !target.card.outOfMecha), true), 0));
		}
		if (this.onBoard || (this.location.id.type === "capsule" && this.isType("entity"))) {
			other.passives.forEach(p => this.passives.push(p.copy(this)));
			other.mutations.forEach(m => m.attach(this));
			other.faculties.forEach(f => this.faculties.push(f.copy()));
		} else {
			if (this.blueprint)
				Reader.read(this.blueprint, this);
		}
		if (this.isType("artifact") || this.isType("secret"))
			this.faculties.push(new ArtifactSkill(new Event(() => new Update(() => this.destroy(), this.gameboard)), 0));

		if (this.onBoard) {
			this.skillPt = 1;
			this.resetSickness();
		}
		var trsdata = this.data;
		trsdata.php = other.php;
		this.gameboard.update();
		this.gameboard.notify("transform", this, {data: trsdata});
		if (glaze)
			this.setState("glazed", true);
	}

	resetSickness () {

		if (this.isType("entity")) {

			this.skillPt = 1;
			if (this.isType("character")) {
				this.actionPt = 1;
				this.motionPt = 0;
				this.firstTurn = true;
				this.furyState = 0;
			}
		}
	}

	refresh () {

		if (this.isType("entity")) {
			this.skillPt = 1;
			if (this.isType("character")) {
				this.actionPt = 1;
				this.motionPt = 1;
				this.firstTurn = false;
				this.furyState = 0;
				delete this.outOfMecha;
				if (this.frozen)
					this.frozenTimer = true;
			}
		}
		if (this.isType("secret"))
			delete this.secretcount;
	}

	chargeMech (charge) {

		if (!this.mecha || !this.isType("artifact"))
			return;
		this.activationPt = (this.activationPt || 0) + charge;
		this.gameboard.notify("chargemech", this, { type: "int", value: charge });
		if (this.activationPt >= this.activation)
			this.activateMech();
	}

	activateMech () {

		if (!this.mecha || !this.isType("artifact"))
			return;

		this.deactivate();
		this.ol = 0;
		this.overload = this.mechactive.overload;
		this.blueprint = this.mechactive.blueprint;
		this.events = [];
		this.passives = [];
		this.innereffects = [];
		this.faculties = [];
		this.clearMutations();
		this.cmutations = [];
		this.pmutations = [];
		this.states = { glazed: this.hasState("glazed") };
		this.cardType = "figure";
		delete this.armor;
		if (this.blueprint)
			Reader.read(this.blueprint, this);
		if (this.scripts)
			this.scripts.forEach(event => Reader.read(event, this));
		if (this.atk && typeof this.atk === 'string')
			this.atk = parseInt(this.atk, 10);
		if (this.range && typeof this.range === 'string')
			this.range = parseInt(this.range, 10);
		this.resetSickness();
		this.activate();
		this.gameboard.update();
		this.gameboard.notify("activatemech", this);
		this.events.forEach(event => {
			if (!event.requirement)
				event.execute(this.gameboard, this)
		});
		this.gameboard.update();
	}

	loadPilot (pilot) {

		if (!this.mecha)
			return;
		let activ = (pilot.finalMana === null) || pilot.finalMana === undefined ? pilot.mana : pilot.finalMana;
		this.gameboard.notify("loadpilot", this, pilot);
		pilot.goto(this.area.capsule);
		this.pilot = pilot;
		this.chargeMech(activ);
	}

	ejectPilot (pilot = this.pilot, location = this.location) {

		if (this.pilot === pilot)
			delete this.pilot;
		let resultloc = undefined;
		if (location.field.tiles.filter(t => t.isEmpty).length > 0) {
			resultloc = pilot.moveNear(location);
			pilot.actionPt = 0;
			pilot.outOfMecha = true;
		} else if (!location.area.hand.isMaxed) {
			pilot.goto(location.area.hand);
		} else {
			pilot.destroy();
		}
		this.gameboard.notify("ejectpilot", this, pilot, location);
	}

	moveNear (tile) {

		if (!tile.neighbors)
			return null;
		if (tile.isEmpty) {
			this.goto(tile);
			return tile;
		}
		var neighbors = tile.neighbors.filter(t => t.isEmpty);
		if (neighbors.length > 0) {
			var res = neighbors[Math.floor(Math.random()*neighbors.length)];
			this.goto(res);
			return tile;
		}
		var adjacents = tile.adjacents.filter(t => t.isEmpty);
		if (adjacents.length > 0) {
			var res = adjacents[Math.floor(Math.random()*adjacents.length)];
			this.goto(res);
			return tile;
		}
		var all = tile.field.tiles.filter(t => t.isEmpty);
		if (all.length > 0) {
			var distance = all.reduce((min, t) => Math.min(min, t.distanceTo(tile)), 4);
			all = all.filter(t => t.distanceTo(tile) === distance);
			var res = all[Math.floor(Math.random()*all.length)];
			this.goto(res);
			return tile;
		}
	}

	isLeftRight (left, right) {

		return (!left || (this.location.firstCard === this)) && (!right || (this.location.lastCard === this))
	}

	mutate (effect, end) {

		var mut = new Mutation(effect, 2);
		mut.attach(this);
		if (end)
			var unsub = end.subscribe((t,s,d) => {
				mut.detach();
				unsub();
			});
		this.gameboard.update();
	}

	clearMutations () {

		if (this.mutations)
			this.mutations.forEach(mut => mut.detach(this));
		this.mutations = [];
	}

	activate () {

		if (this.activated)
			return;
		this.activated = true;
		this.passives.forEach(passive => passive.activate());
	}

	deactivate () {

		if (!this.activated)
			return;
		this.activated = false;
		this.passives.forEach(passive => passive.deactivate());
	}

	get eff () {

		var contacteffect = (eff) => {

			if (!this.oncontact || this.computingcontact)
				return eff;
			this.computingcontact = true;
			var res = Object.assign({}, eff);
			this.cmutations.forEach(cmut => {
				if (!cmut.targets || cmut.targets(this.oncontact))
					res = cmut.effect(res);
			});
			this.computingcontact = false;
			return res;
		}

		if (this.isEff || this.computing)
			return contacteffect(this.mutatedState || this);
		if (!this.mutatedState)
			this.update();
		return contacteffect(this.mutatedState);
	}

	update () {

		if (this.isEff)
			return;
		if (this.computing)
			return;
		this.computing = true;
		var wasCovering = this.hasState("cover neighbors");
		var wasFlying = this.hasState("flying");
		var res;
		res = Object.assign({}, this);
		res.isEff = true;
		res.original = this;
		res.area = this.area;
		res.states = Object.assign({}, this.states);
		let updatephp = () => {
			if (this.isType("character") && this.onBoard) {
				this.php = this.php || { hp: this.hp, chp: this.chp };
				var plushp = Math.max (res.negativehpmodifier || 0, res.hp - this.php.hp);
				this.chp = Math.min(res.hp, (this.chp === null || this.chp === undefined ? this.hp : this.chp) + plushp);
				res.chp = this.chp;
				this.php = { hp: res.hp, chp: res.chp };
			}
		}
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});
		if (this.isType("figure") && res.pilot && res.pilot.pmutations)
			res.pilot.pmutations.forEach(pm => pm(res));
		if (this.onBoard) {
			if (this.location.hasHazards("wind")) {
				res.states = res.states || {};
				res.states.initiative = true;
			} 
			if (this.location.hasHazards("shadow")) {
				res.states = res.states || {};
				res.states.concealed = true;
			}
		}
		if (!this.mutatedState)
			this.mutatedState = res;
		this.mutatedState.states = Object.assign({}, res.states);
		res = this.mutations.sort((a, b) => a.priority - b.priority).reduce((card, mut) => { let r = mut.apply(card); this.mutatedState.states = Object.assign({}, r.states); return r; }, res);
		if (this.finalMana !== undefined) res.mana = this.finalMana;
		if (this.finalOverload !== undefined) res.ol = this.finalOverload;
		updatephp();
		if (this.states && this.states.frozen && !this.frozen)
			this.states.frozen = false;
		if (this.poisondmg && this.hasState("vaccinated")) 
			delete this.poisondmg;
		this.states = this.states || {};
		this.states.poisoned = this.poisoned;
		this.computing = false;

		this.mutatedState = res;

		if ((!wasCovering && res.states["cover neighbors"]) || (!wasFlying && res.states["flying"]))
			this.gameboard.update();
		if (res.chp != null && res.chp != undefined && res.chp <= 0) {
			this.goingtodie = true;
			new Update(() => { if (this.goingtodie) this.destroy(); }, this.gameboard);
		}
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
		delete this.php;
		delete this.actionPt;
		delete this.skillPt;
		delete this.motionPt;
		delete this.firstTurn;
		this.deactivate();
	}
}

module.exports = Card;