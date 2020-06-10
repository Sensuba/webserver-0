var AI = require("./AI");
var DuelData = require("./analyse/DuelData");
var Play = require("./analyse/Play");
var Cloner = require("./analyse/Cloner");
var Action = require("./../model/Action");

class TrainingAI extends AI {

	constructor (gameboard, no, deck) {

		super(gameboard, no);
		this.deck = deck;
		this.data = new DuelData();
		this.cloner = new Cloner();
	}

	async act () {

		var plays = this.generatePlays();
		//var state = this.computeBoardState();//console.log(state.areas[1].hand.cards.map(c => c.nameCard));
		//console.log(state.areas[0].field.tiles[6].card.nameCard);
		var state = this.computeBoardState();
		var current = this.compute(state);

		var maxValue = (s, i, c) => {

			var pvalue = this.compute(s);
			if ((pvalue - current) < (i-2) * 300 || (i >= 2 && pvalue < c) || (i >= 3 && pvalue < c + 300) || i > 3)
				return pvalue;
			var pplays = this.generatePlays(s);
			while ((i == 1 && pplays.length > 15) || (i == 2 && pplays.length > 5) || (i >= 3 && pplays.length > 2))
				pplays = pplays.splice(Math.floor(Math.random()*pplays.length), 1);
			var pvalues = pplays.map(p => maxValue(this.computeBoardState(p, s), i+1, Math.max(c, pvalue)));
			return pvalues.reduce((max, v) => Math.max(max, v), pvalue);
		}
		
		var values = plays.map(p => maxValue(this.computeBoardState(p), 1, current));

		if (plays.length > 0 && values.some(v => v > current))
			return plays[values.indexOf(Math.max(...values))].command;

		return { type: "endturn" };
	}

	generateDeck () {

		return {
		  hero: 3,
		  body: [
		    156, 156, 145, 145, 152,
		    152, 257, 257, 309, 309,
		    191, 191, 131, 131, 104,
		    104, 133, 133, 136, 136,
		    110, 110, 151, 151, 192,
		    192, 103, 103, 224, 224
		  ]
		}
	}

	generatePlays (state) {

		if (!state)
			state = this.gameboard;
		var area = state.areas[this.no];
		var plays = [];
		area.hand.cards.forEach(c => {
			if (c.canBePlayed) {
				if (c.targets.length === 0)
					plays.push(new Play("play", c));
				else area.gameboard.tiles.forEach(t => {
					if (c.canBePlayedOn([t])) {
						if (c.targets.length === 1)
							plays.push(new Play("play", c, t));
						else area.gameboard.tiles.forEach(t2 => {
							if (c.canBePlayedOn([t, t2]))
								plays.push(new Play("play", c, t, t2));
						})
					}
				})
			}
		})
		area.field.entities.forEach(c => {
			if (c.canAct) {
				c.faculties.forEach((f, i) => {
					if (!f.event.requirement)
						if (c.canUse(f))
							plays.push(new Play("faculty", c, i));
					else area.gameboard.tiles.forEach(t => {
						if (c.canUse(f, t))
							plays.push(new Play("faculty", c, i, t));
					})
				})
				area.opposite.field.entities.forEach(e => {
					if (c.canAttack(e))
						plays.push(new Play("attack", c, e));
				})
				if (c.canMove) {
					c.location.adjacents.forEach(t => {
						if (c.canMoveOn(t))
							plays.push(new Play("move", c, t));
					})
				}
			}
		})
		return plays;
	}

	computeBoardState (play, basis) {

		if (!basis)
			basis = this.gameboard;
		var state = this.cloner.cloneBoard(basis);
		if (play)
			state.command(play.command, this.no);
		return state;
	}

	compute (state) {

		var area = state.areas[this.no];

		var heuristic = (h, pow, mlt) => Math.pow(h(area), pow) * mlt - Math.pow(h(area.opposite), pow) * mlt;

		var hHeroLethal = heuristic(h => h.hero.destroyed ? 100000 : 0, 1, -1);

		var hHeroHp = heuristic(h => h.hero.chp, 0.7, 13);

		var hHeroLevel = heuristic(h => h.hero.level, 1, 600);

		//var avghand = area.hand.isEmpty ? 0 : (area.hand.cards.reduce((sum, e) => e.mana, 0) / area.hand.count);
		//var neededReceptacles = (2/3 + area.hand.count/3) * avghand;
		var hManaReceptacles = heuristic(h => h.manapool.receptacles.length, 0.8, 2000);

		var hGems = heuristic(h => h.manapool.gems, 0.85, 600);

		var hBoardPresence = heuristic(h => h.field.entities.length, 0.8, 1000);

		var hBoardPower = Math.pow(area.field.entities.filter(e => e.isType("figure")).reduce((acc, e) => acc + e.eff.atk * 2 + e.eff.chp + (200 * e.eff.range - 1), 0), 0.8) * 3
			-  Math.pow(area.opposite.field.entities.filter(e => e.isType("figure")).reduce((acc, e) => acc + e.eff.atk + e.eff.chp + (200 * e.eff.range - 1), 0), 0.8) * 5;

		var effectPower = (card) => {

			var value = 0;
			value += card.faculties.reduce((acc, f) => acc + (f instanceof Action ? 2 : 0.5), 0);
			value += card.passives.length;
			if (card.poisondamage)
				value -= card.poisondmg / 100;
			["fury", "initiative", "immune", "concealed", "lethal", "cover neighbors"].forEach(state => { if (card.hasState(state)) value += 2 });
			["exaltation", "flying"].forEach(state => { if (card.hasState(state)) value += 1 });
			["cannot attack heroes", "frozen", "passive", "static"].forEach(state => { if (card.hasState(state)) value -= 1 });
			return value;
		}

		var hBoardEffect = Math.pow(area.field.entities.filter(e => e.isType("figure")).reduce((acc, e) => acc + effectPower(e), 0), 0.9) * 300;
			-  Math.pow(area.opposite.field.entities.filter(e => e.isType("figure")).reduce((acc, e) => acc + effectPower(e), 0), 0.9) * 500;

		var hHeroCover = heuristic(h => h.field.entities.filter(e => e.cover(h.hero, false)).length * (2.5 - h.hero.chp/3000), 0.8, 300);

		var hBoardCover = heuristic(h => h.field.entities.reduce((acc, e) => {
			if (!e.covered || e.isType("hero"))
				return 0;
			if (e.isType("artifact"))
				return 3;
			var value = 1;
			if (e.range > 1)
				value += 1 + e.range;
			value += e.faculties ? e.faculties.reduce((acc, f) => acc + (f instanceof Action ? 4 : 0.5), 0) : 0;
			value += e.passives ? e.passives.length * 2 : 0;
			return value;
		}, 0), 0.8, 200);

		var hHandSize = heuristic(h => h.hand.count, 0.85, 600);

		var value = hHeroLethal + hHeroHp + hManaReceptacles + hGems + hBoardPresence + hBoardPower + hHeroCover + hBoardCover + hHandSize + hHeroLevel;

		return value;
	}
}

module.exports = TrainingAI;