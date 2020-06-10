var GameBoard = require("./../../model/GameBoard");
var Area = require("./../../model/Area");
var Card = require("./../../model/Card");
var Log = require("./../../model/Log");
var Action = require("./../../model/Action");
var Event = require("./../../model/Event");
var Reader = require("./../../model/blueprint/Reader");

class Cloner {

	cloneBoard (model) {

		var clone = new GameBoard();
		clone.data = { cards: [], items: {} }

		clone.updates = [];
		clone.auras = [];
		clone.subscriptions = {};
		clone.indexSubscription = 0;
		clone.started = model.started;
		clone.log = new Log();
		var notify = clone.notify;
		clone.notify = () => {};

		clone.areas = [
			new Area(model.areas[0].id.no, clone),
			new Area(model.areas[1].id.no, clone)
		];
		clone.currentArea = clone.areas[model.currentArea.id.no];
		model.data.cards.forEach(c => clone.data.cards.push(this.cloneCard(c, clone)));
		model.data.cards = model.data.cards.sort((a, b) => a.id.no - b.id.no);
		clone.areas.forEach((a, i) => this.copyArea(a, model.areas[i]));
		clone.notify = notify;
		return clone;
	}

	cloneCard (model, board) {

		var clone = new Card(0, 0, 0, true);
		clone.id = { type: "card", no: model.id.no }
		//board.data.cards.push(clone);
		board.register(clone);
		clone.equals = other => other.id && clone.id.type === other.id.type && clone.id.no === other.id.no;
		clone.gameboard = board;
		clone.location = board.find(model.location.id);
		clone.model = model.model;
		clone.resetBody();
		var data = model.data;
		for (var k in data) {
			if (k === "id")
				continue;
			clone[k] = data[k];
			if (!isNaN(clone[k]))
				clone[k] = parseInt(clone[k], 10);
		}
		clone.model = model.model;
		clone.identified = [false, false];
		clone.parent = model.parent;
		clone.events = [];
		clone.faculties = [];
		clone.passives = [];
		clone.innereffects = [];
		clone.mutations = [];
		clone.cmutations = [];
		clone.states = Object.assign({}, model.states);
		clone.variables = {};
		if (model.variables)
			Object.keys(model.variables).forEach(k => {
				if (model.variables[k])
					clone.variables[k] = model.variables[k].id ? board.find(model.variables[k].id) : model.variables[k]
			});
		clone.shield = model.shield;
		clone.poisondmg = model.poisondmg;
		clone.frozenTimer = model.frozenTimer;
		if (clone.isType("hero")) {
			clone.faculties.push(new Action(new Event(() => clone.area.manapool.createReceptacle())));
			clone.area.hero = clone;
		}
		if (clone.blueprint)
			Reader.read(clone.blueprint, clone);
		if (model.activated)
			clone.activate();
		return clone;
	}

	copyArea (copy, model) {

		copy.extraTurns = model.extraTurns;
		this.copyDeck(copy.deck, model.deck);
		this.copyMulticardsLocation(copy.hand, model.hand);
		this.copyMulticardsLocation(copy.cemetery, model.cemetery);
		this.copyMulticardsLocation(copy.discard, model.discard);
		this.copyMulticardsLocation(copy.capsule, model.capsule);
		this.copyMulticardsLocation(copy.nether, model.nether);
		this.copyMulticardsLocation(copy.choosebox, model.choosebox);
		this.copySinglecardLocation(copy.court, model.court);
		this.copyField(copy.field, model.field);
		this.copyManapool(copy.manapool, model.manapool);
	}

	copyDeck (copy, model) {

		this.copyMulticardsLocation(copy, model);
		copy.curse = model.curse;
	}

	copyField (copy, model) {

		copy.tiles.forEach((t, i) => this.copySinglecardLocation(t, model.tiles[i]));
	}

	copySinglecardLocation (copy, model) {

		if (model.card)
			copy.card = copy.area.gameboard.find(model.card.id);
	}

	copyMulticardsLocation (copy, model) {

		model.cards.forEach(c => copy.cards.push(copy.area.gameboard.find(c.id)));
	}

	copyManapool (copy, model) {

		copy.receptacles = [...model.receptacles];
		copy.gems = model.gems;
		copy.extramana = model.extramana;
	}
}

module.exports = Cloner;