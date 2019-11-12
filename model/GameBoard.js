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

	init (d1, d2) {

		this.data = {
			cards: []
		}

		this.updates = [];
		this.auras = [];
		this.subscriptions = {};
		this.indexSubscription = 0;
		this.log = new Log();
		this.notify("init", this, {type: "int", no: d1.hero}, {type: "int", no: d2.hero});

		this.areas = [
			new Area(0, this),
			new Area(1, this)
		];

		this.areas[0].init(d1);
		this.areas[1].init(d2);
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
		this.currentArea.draw (4);
		this.currentArea.opposite.draw (5);
		this.currentArea.opposite.manapool.createGem ();
		this.currentArea.newTurn ();
		//console.log(this.currentArea.hand.cards);
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	newTurn () {


		this.notify("endturn", this.currentArea);
		if (this.currentArea.extraTurns)
			this.currentArea.extraTurns--;
		else
			this.currentArea = this.currentArea.opposite;
		this.currentArea.newTurn();
	}

	command (cmd, player) {

		var p = this.areas[player];

		switch (cmd.type) {
		case "play": {
			let card = this.data.cards[cmd.id.no],
				targets = cmd.targets ? cmd.targets.map(id => this.tiles.find(t => t.id.no === id.no)) : undefined;
			if (card.canBePlayedOn(targets))
				card.play(targets);
			break; }
		case "attack": {
			let card = this.data.cards[cmd.id.no],
				target = this.data.cards[cmd.target.no];
			if (card.canAttack(target))
				card.attack(target);
			break; }
		case "move": {
			let card = this.data.cards[cmd.id.no],
				tile = this.tiles.find(t => t.id.no === cmd.to.no);
			if (card.canMoveOn(tile))
				card.move(tile);
			break; }
		case "faculty": {
			let card = this.data.cards[cmd.id.no],
				target = cmd.target ? this.tiles.find(t => t.id.no === cmd.target.no) : undefined;
			if (card.faculties && card.faculties.length > cmd.faculty && card.canUse(card.faculties[cmd.faculty], target))
				card.use(cmd.faculty, target);
			break; }
		case "endturn":
			if (p.isPlaying)
				this.newTurn();
			break;
		default: break;
		}
	}

	registerCard (card) {

		this.data.cards.push(card);
		return this.data.cards.length-1;
	}

	update () {

		while (this.updates.length > 0)
			this.updates[0].trigger();
		this.data.cards.forEach(card => card.update());
	}

	addAura (aura) {

		this.auras.push(aura);
	}

	clearAura (aura) {

		this.auras = this.auras.filter(a => a !== aura)
	}

	heroDies (player) {

		this.end(1-player);
	}
}

module.exports = GameBoard;