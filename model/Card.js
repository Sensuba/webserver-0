var Event = require("./Event");
var Hand = require("./Hand");
var Deck = require("./Deck");
var Tile = require("./Tile");
var Court = require("./Court");
var Cemetery = require("./Cemetery");
var Discard = require("./Discard");
var Update = require("./Update");
var Action = require("./Action");
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
		if (location) {
			this.gameboard.notify("newcard", this, location);
			this.goto(location);
			if (this.isType("hero") && this.onBoard) {
				this.skillPt = 1;
				this.chp = this.hp;
				this.activate();
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
		delete copy.oncontact;
		delete copy.mutatedState;
		delete copy.mutdata;
		delete copy.php;
		delete copy.dying;
		delete copy.goingtodie;
		delete copy.variables;
		delete copy.countered;
		delete copy.retarget;
		delete copy.secretcount;
		delete copy.secretparam;
		delete copy.secreteffect;
		copy.model = this.model.idCardmodel;
		if (copy.parent)
			copy.parent = copy.parent.idCardmodel;
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
		if (this.isType("character"))
			this.resetSickness();
		this.activate();
		this.gameboard.notify("summon", this, tile);
		tile.applyHazards(this);
		this.gameboard.update();
	}

	goto (loc) {

		if (this.location === loc)
			return;
		var former = this.location;

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
		if (former instanceof Tile && !(loc instanceof Tile) && this.activated)
			this.deactivate();
		if (former && former.hasCard (this))
			former.removeCard (this);
		if (former && (loc === null || former.locationOrder > loc.locationOrder || former.locationOrder === 0))
			this.resetBody ();
		if (loc && !loc.hasCard (this))
			loc.addCard (this);
		if (loc instanceof Tile && !(former instanceof Tile) && !this.activated)
			this.activate();
		if (former instanceof Tile && loc instanceof Tile && this.activated && former.area !== loc.area) {
			this.deactivate();
			this.activate();
		}
		if (this.onBoard && former && former.area === this.area.opposite) {
			this.skillPt = 1;
			if (this.isType("character"))
				this.resetSickness();
		}
		if (this.onBoard && this.isType("secret")) {
			var secrets = this.innereffects.filter(e => e.type === "secret");
			if (!this.area || !this.area.isPlaying)
				this.secretparam = 0;
			if (secrets.length === 1)
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
		let wasActivated = this.activated;
		if (this.passives)
			this.passives.forEach(passive => passive.deactivate());
		if (this.activated)
			this.deactivate();
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
		this.ol = 0;
		this.events = [];
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		this.mutations = [];
		this.cmutations = [];
		this.states = {};
		this.shield = false;
		delete this.poisondmg;
		delete this.armor;
		this.dying = false;
		delete this.variables;
		delete this.countered;
		delete this.retarget;
		delete this.secretcount;
		delete this.secretparam;
		delete this.secreteffect;
		delete this.goingtodie;
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
		this.mutations = [];
		this.cmutations = [];
		this.states = {};
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
	}

	levelDown () {

		if (!this.isType("hero"))
			return;
		if (this.level === 0)
			return;
		this.levelUp(this.level - 1);
	}

	freeze () {

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
		this.dying = true;
		let onboard = this.onBoard;
		this.gameboard.notify(discard ? "discardcard" : "destroycard", this, { type: "boolean", value: onboard });
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
		if (this.hasState("will to live") && dmg >= this.chp) {
			dmg = this.chp - 1;
			if (dmg <= 0)
				return;
		}

		this.chp -= dmg;
		if (!discret)
			this.gameboard.notify("damagecard", this, dmg, src);
		if (this.chp <= 0 || (!this.isType("hero") && src && src.hasState("lethal"))) {
			new Update(() => this.destroy(), this.gameboard);
		}
		if (discret)
			return () => this.gameboard.notify("damagecard", this, dmg, src);
	}

	poison (psn) {


		if (!this.chp || psn <= 0 || this.isGhost)
			return;
		if (this.hasState("immune"))
			return;

		this.poisondmg = (this.poisondmg || 0) + psn;
		this.gameboard.notify("poisoncard", this, psn);
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
	}

	triggerPoison () {

		this.gameboard.notify("poisontrigger", this, this.poisondmg);
		this.damage(this.poisondmg, null);
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
		if (hp < 0 && !this.isType("artifact"))
			this.chp = Math.min(this.chp, this.eff.hp);
		this.range = Math.min(this.range + range, MAX_RANGE);
		this.gameboard.notify("boostcard", this, atk, hp, range);
		this.update();
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	changeCost (value) {

		if (!value || (value < 0 && this.mana <= 0))
			return;

		this.mana = Math.max(0, this.mana + value);
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
			this.chp = hp;
			//this.originalHp = this.hp;
			delete this.php;
		}
		if (range || range === 0) {
			this.range = range;
			//this.originalRange = this.range;
		}
		this.gameboard.notify("setcard", this, cost, atk, hp, range);
		if (this.chp <= 0)
			new Update(() => this.destroy(), this.gameboard);
	}

	boostoverload (value) {

		if (!value)
			return;

		this.ol += value;
		this.gameboard.notify("overloadcard", this, value);
	}

	silence () {

		this.deactivate();
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		this.mutations = [];
		this.cmutations = [];
		this.events = [];
		this.states = {};
		delete this.poisondmg;
		delete this.armor;
		this.breakShield();
		delete this.blueprint;
		delete this.variables;
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
		if ((eff.actionPt || (this.hasState("fury") && eff.furyState === 1)) && (!eff.firstTurn || this.hasState("rush")))
			return true;

		return false;
	}

	canAttack (target) {

		var eff = this.eff;

		if (!this.isType("character") || !this.onBoard || !target.onBoard || this.area === target.area || eff.frozen || target.isType("secret") || eff.atk <= 0 || eff.range <= 0 || target.concealed || this.hasState("static") || this.hasState("passive"))
			return false;
		if (eff.firstTurn && !this.hasState("rush"))
			return false;
		if (!eff.actionPt && (!this.hasState("fury") || eff.furyState !== 1))
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
		this.gameboard.notify("charattack", this, target, {type:"bool", value: auto});
		if (this.retarget) {
			target = this.retarget.card;
			delete this.retarget;
		}
		if (this.destroyed || this.isGhost || !this.onBoard) {
			this.gameboard.update();
			return;
		}
		this.oncontact = target;
		target.oncontact = this;
		var dmg1 = target.damage(this.eff.atk - (target.eff.armor || 0), this, true);
		var dmg2;
		if (!this.eff.states.initiative)
			dmg2 = target.ripost(this);
		if (dmg2) dmg2(); if (dmg1) dmg1();
		this.oncontact = null;
		target.oncontact = null;
		if (!target.isType("artifact"))
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

		this.area.manapool.use(this.eff.mana);
		switch(this.cardType) {
		case "figure":
		case "artifact":
			this.summon(targets[0]);
			this.gameboard.notify("playcard", this, targets[0], targets[1]);
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
			this.gameboard.notify("playcard", this, spelltarget);
			spelltarget = targets ? (this.retarget || targets[0]) : undefined;
			if (this.countered || (spelltarget && this.area && spelltarget.area && this.area != spelltarget.area && spelltarget.immune)) {
				this.destroy();
				break;
			}
			this.events.forEach(event => event.execute(this.gameboard, this, spelltarget));
			this.destroy();
			break;
		case "secret":
			this.goto(targets[0]);
			this.gameboard.notify("playcard", this, targets[0]);
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

		if (this.variables)
			delete this.variables[name];
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
			this.activate();
			if (this.isType("character"))
				this.resetSickness();
		}
		this.gameboard.notify("transform", this, {data:this.data});
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
		if (this.isType("entity")) {
			this.php = other.php;
			if (other.php) {
				this.mutatedState = this.mutatedState || {};
				this.mutatedState.hp = other.php.hp;
				this.mutatedState.chp = other.php.chp;
			}
			this.update();
			this.chp = other.chp;
		}
		this.events = [];
		this.faculties = [];
		this.passives = [];
		this.innereffects = [];
		this.mutations = [];
		this.cmutations = [];
		this.states = Object.assign({}, other.states);
		this.variables = Object.assign({}, other.variables);
		this.shield = other.shield;
		this.armor = other.armor;
		this.poisondmg = other.poisondmg;
		this.frozenTimer = other.frozenTimer;
		this.identified = [false, false];
		if (wasActivated)
			this.activate();
		if (this.blueprint)
			Reader.read(this.blueprint, this);

		if (this.onBoard) {
			this.skillPt = 1;
			if (this.isType("character"))
				this.resetSickness();
		}
		var trsdata = this.data;
		trsdata.php = other.php;
		this.gameboard.notify("transform", this, {data: trsdata});
		if (glaze)
			this.setState("glazed", true);
	}

	resetSickness () {

		this.actionPt = 1;
		this.skillPt = 1;
		this.motionPt = 0;
		this.firstTurn = true;
		this.furyState = 0;
	}

	refresh () {

		if (this.isType("entity")) {
			this.skillPt = 1;
			if (this.isType("character")) {
				this.actionPt = 1;
				this.motionPt = 1;
				this.firstTurn = false;
				this.furyState = 0;
				if (this.frozen)
					this.frozenTimer = true;
			}
		}
		if (this.isType("secret"))
			delete this.secretcount;
	}

	mutate (effect, end) {

		var mut = new Mutation(effect);
		mut.attach(this);
		if (end)
			var unsub = end.subscribe((t,s,d) => {
				mut.detach();
				unsub();
			});
		this.gameboard.update();
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
		var res;
		res = Object.assign({}, this);
		res.isEff = true;
		res.original = this;
		res.states = Object.assign({}, this.states);
		let updatephp = () => {
			if (this.isType("character") && this.onBoard) {
				this.php = this.php || { hp: this.hp, chp: this.chp };
				var plushp = Math.max (0, res.hp - this.php.hp);
				this.chp = Math.min(res.hp, (this.chp || this.hp) + plushp);
				res.chp = this.chp;
				this.php = { hp: res.hp, chp: res.chp };
			}
		}
		this.gameboard.auras.forEach(aura => {
			if (aura.applicable(this))
				res = aura.apply(res);
		});
		if (!this.mutatedState)
			this.mutatedState = res;
		this.mutatedState.states = Object.assign({}, res.states);
		res = this.mutations.reduce((card, mut) => mut.apply(card), res);
		updatephp();
		if (this.states && this.states.frozen && !this.frozen)
			this.states.frozen = false;
		this.computing = false;

		this.mutatedState = res;

		if (!wasCovering && res.states["cover neighbors"])
			this.gameboard.update();
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