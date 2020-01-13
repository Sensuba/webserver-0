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
			cards: []
		}

		this.updates = [];
		this.auras = [];
		this.subscriptions = {};
		this.indexSubscription = 0;
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
		//console.log(this.currentArea.hand.cards);
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	newTurn () {

		if (this.currentArea.choosebox.opened)
			this.currentArea.choosebox.chooseAtRandom();
		this.notify("endturn", this.currentArea);
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

	command (cmd, player) {

		var p = this.areas[player];

		switch (cmd.type) {
		case "concede": {
			if (!this.ended)
				p.hero.destroy();
			break; }
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
		case "choose": {
			let card = this.data.cards[cmd.id.no];
			this.currentArea.choosebox.choose(card);
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

		if (this.timer)
			clearTimeout(this.timer);
		this.end(1-player);
	}
}

module.exports = GameBoard;

/*

<div class="sensuba-dialog" style="
    top: 20vw;
    left: calc(50% - 20em - 8vw);
    position: absolute;
    height: 6em;
    width: 20em;
"><div class="sensuba-dialog-icon" style="
    position: absolute;
    height: 3em;
    width: 3em;
    top: -1.6em;
    left: -1.6em;
    border-radius: 50%;
    border: solid 2px black;
    overflow: hidden;
"><img src="https://i.ibb.co/qNwWzzR/freezer.jpg" style="
    height: 6vw;
    width: 4.5vw;
    margin-top: calc(-0.5vw - 3px);
    margin-left: calc(-0.825vw - 3px);
    -o-object-fit: cover;
    object-fit: cover;
"></div>
    <div class="sensuba-dialog-box" style="
    background: #FFFFFF80;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    font-weight: 500;
    text-align: left;
    padding: 0.5em 1em;
    border: #000000a0 dashed 2px;
"><p>A namek dare to oppose me? How funny these miserable insects can be.</p></div>
</div>

*/