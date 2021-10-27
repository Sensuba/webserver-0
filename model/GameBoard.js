var Area = require("./Area");
var Log = require("./Log");

class GameBoard {

	constructor () {

		this.id = { type: "gameboard", no: 0 };

		this.send = () => {};
		this.whisper = () => {};
		this.explain = () => {};
		this.end = () => {};
	}

	init (p1, p2) {

		this.data = {
			cards: [],
			items: {}
		}
		this.register(this);

		this.updates = [];
		this.auras = [];
		this.subscriptions = {};
		this.indexSubscription = 0;
		this.truth = true;
		this.log = new Log();
		this.notify("init", this,
			{type: "string", value: p1.name},
			{type: "string", value: p1.avatar},
			{type: "int", no: p1.deck.hero},
			{type: "string", value: p2.name},
			{type: "string", value: p2.avatar},
			{type: "int", no: p2.deck.hero}
		);

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		];

		this.areas[0].init(p1.deck, p1.props);
		this.areas[1].init(p2.deck, p2.props);
		this.started = true;
	}

	notify (type, src, ...data) {

		var datamap = data.map(d => d ? d.id || d : d);
		this.log.add({ type, src, data });
		this.send(type, src.id, datamap);
		if (!this.subscriptions[type])
			return;
		this.subscriptions[type].slice().forEach(sub => sub.notify(type, src, data));
	}

	notifySpectators (type, src, ...data) {

		//var datamap = data.map(d => d ? d.id || d : d);
		this.log.add({ type, src, data });
		this.explain(type, src.id, data);
		//if (!this.subscriptions[type])
		//	return;
		//this.subscriptions[type].slice().forEach(sub => sub.notify(type, src, data));
	}

	subscribe (type, notify) {

		if (!this.subscriptions[type])
			this.subscriptions[type] = [];
		let id = this.indexSubscription++;
		this.subscriptions[type].push({ id, notify });
		return () => this.subscriptions[type].splice(this.subscriptions[type].findIndex(sub => sub.id === id), 1);
	}

	start (area) {

		this.notify("start", this);
		area = area || this.areas[Math.floor(Math.random()*2)];
		this.currentArea = area;
		this.currentArea.draw (this.currentArea.startingHand === undefined ? 4 : this.currentArea.startingHand);
		this.currentArea.opposite.draw (this.currentArea.opposite.startingHand === undefined ? 5 : this.currentArea.opposite.startingHand);
		if (this.currentArea.startingGem)
			this.currentArea.manapool.createGem ();
		if (this.currentArea.opposite.startingGem !== false)
			this.currentArea.opposite.manapool.createGem ();
		this.currentArea.newTurn ();
		this.resetTimer();
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	newTurn () {

		if (this.currentArea.choosebox.opened)
			this.currentArea.choosebox.chooseAtRandom();
		this.notify("endturn", this.currentArea);
		this.update();
		this.notify("cleanup", this.currentArea);
		if (this.currentArea.extraTurns)
			this.currentArea.extraTurns--;
		else
			this.currentArea = this.currentArea.opposite;
		this.currentArea.newTurn();
		this.resetTimer();
	}

	resetTimer () {

		if (!this.timed)
			return;
		if (this.timer)
			clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			if (!this.ended)
				this.newTurn();
		}, 153000);
	}


	acceptCommand (cmdtype) {

		this.log.add({ type: "command", cmd: cmdtype });
	}

	command (cmd, player) {

		if (this.ended)
			return;

		var p = this.areas[player];

		switch (cmd.type) {
		case "concede": {
			if (!this.ended) {
				this.acceptCommand(cmd.type);
				p.hero.destroy();
			}
			break; }
		case "play": {
			let card = this.data.cards[cmd.id.no],
				targets = cmd.targets ? cmd.targets.map(id => this.tiles.find(t => t.id.no === id.no)) : undefined;
			if (card.canBePlayedOn(targets)) {
				this.acceptCommand(cmd.type);
				card.play(targets);
			}
			break; }
		case "attack": {
			let card = this.data.cards[cmd.id.no],
				target = this.data.cards[cmd.target.no];
			if (card.canAttack(target)) {
				this.acceptCommand(cmd.type);
				card.attack(target);
			}
			break; }
		case "move": {
			let card = this.data.cards[cmd.id.no],
				tile = this.tiles.find(t => t.id.no === cmd.to.no);
			if (card.canMoveOn(tile)) {
				this.acceptCommand(cmd.type);
				card.move(tile);
			}
			break; }
		case "faculty": {
			let card = this.data.cards[cmd.id.no],
				target = cmd.target ? this.tiles.find(t => t.id.no === cmd.target.no) : undefined;
			if (card.faculties && card.faculties.length > cmd.faculty && card.canUse(card.faculties[cmd.faculty], target)) {
				this.acceptCommand(cmd.type);
				card.use(cmd.faculty, target);
			}
			break; }
		case "param": {
			let card = this.data.cards[cmd.id.no];
			if (card.isType("secret") && card.onBoard && p.isPlaying) {
				if (cmd.option === "destroy")
					card.destroy();
				if (cmd.value >= 0 && cmd.value <= 5)
					card.parameter(cmd.option, cmd.value);
			}
			break; }
		case "choose": {
			let card = this.data.cards[cmd.id.no];
			this.acceptCommand(cmd.type);
			this.currentArea.choosebox.choose(card);
			break; }
		case "endturn":
			if (p.isPlaying) {
				this.acceptCommand(cmd.type);
				this.newTurn();
			}
			break;
		default: break;
		}
	}

	registerCard (card) {

		this.data.cards.push(card);
		return this.data.cards.length-1;
	}

	register (item) {

		var id = item.id;
		this.data.items[id.type] = this.data.items[id.type] || {};
		this.data.items[id.type][id.no] = item;
	}

	find (id) {

		return id ? (this.data.items[id.type] ? this.data.items[id.type][id.no] : undefined) : id;
	}

	update () {

		if (!this.updateState) {
			this.updateState = 1;
			while (this.updates.length > 0)
				this.updates[0].trigger();
			[3, 2, 1, 0].forEach(prio => this.data.cards.forEach(card => {
				if (this.updateState === 2)
					return;
				if (card.location && card.location.locationOrder === prio)
					card.update();
			}));
			if (this.updateState === 2) {
				delete this.updateState;
				this.update();
			} else delete this.updateState;
		} else
			this.updateState = 2;
	}

	addAura (aura) {

		this.auras.push(aura);
	}

	clearAura (aura) {

		this.auras = this.auras.filter(a => a !== aura)
	}

	heroDies (player) {

		if (this.ended)
			return;
		if (this.timer)
			clearTimeout(this.timer);
		if (this.areas[1-player].hero.destroyed || this.areas[1-player].hero.isGhost)
			this.end(1-this.currentArea.id.no)
		else this.end(1-player);
	}
}

module.exports = GameBoard;