var AI = require("./AI");
var DuelData = require("./DuelData");
var Play = require("./Play");
var Cloner = require("./Cloner");
var Action = require("./model/Action");

var WinHeuristic = require("./heuristics/WinHeuristic");
var HPHeuristic = require("./heuristics/HPHeuristic");
var ManaHeuristic = require("./heuristics/ManaHeuristic");
var GemHeuristic = require("./heuristics/GemHeuristic");
var HeroLevelHeuristic = require("./heuristics/HeroLevelHeuristic");
var HandSizeHeuristic = require("./heuristics/HandSizeHeuristic");
var BoardPresenceHeuristic = require("./heuristics/BoardPresenceHeuristic");
var CoverHeuristic = require("./heuristics/CoverHeuristic");

class TrainingAI extends AI {

	constructor (gameboard, no, deck) {

		super(gameboard, no);
		this.deck = deck;
		this.data = new DuelData();
		this.cloner = new Cloner();
	}

	act (callback) {

		var state = this.computeBoardState();
		var plays = this.generatePlays(state);
		var current = this.compute(state);

		var values = [];

		setTimeout(() => this.computePlays(callback, state, plays, current, values), 50);
		
		//var values = plays.map(p => maxValue(this.computeBoardState(p), 1, current));
		//console.log(values.map((v,i) => {return {v: v, p: plays[i].command};}))

	}

	computePlays (callback, state, plays, current, values) {

		var maxValue = (s, i, c) => {

			var pvalue = this.compute(s);
			if (pvalue > 100)
				return pvalue/i;
			//if ((pvalue - current) < (i-2) * 300 || (i >= 2 && pvalue < c) || (i >= 3 && pvalue < c + 300) || i > 3)
			if ((i >= 2 && pvalue < c) || i > 3)
				return pvalue;
			var pplays = this.generatePlays(s);
			//while ((i == 1 && pplays.length > 15) || (i == 2 && pplays.length > 5) || (i >= 3 && pplays.length > 2))
			while ((i == 1 && pplays.length > 15) || (i == 2 && pplays.length > 8) || (i >= 3 && pplays.length > 3))
				pplays = pplays.splice(Math.floor(Math.random()*pplays.length), 1);
			var pvalues = pplays.map(p => maxValue(this.computeBoardState(p, s), i+1, Math.max(c, pvalue)));
			s.command({ type: "endturn" }, this.no);
			pvalue = this.compute(s);
			return pvalues.reduce((max, v) => Math.max(max, v), pvalue);
		}

		var i = values.length;
		values.push(maxValue(this.computeBoardState(plays[i]), 1, current));
		if (i+1 >= plays.length)
			this.completeComputation(callback, state, plays, current, values);
		else setTimeout(() => this.computePlays(callback, state, plays, current, values), 50);
	}

	completeComputation (callback, state, plays, current, values) {

		//console.log(values.map((v, i) => {return{v, p: plays[i]}}));

		state.command({ type: "endturn" }, this.no);
		current = this.compute(state);

		if (plays.length > 0 && values.some(v => v > current)) {
			var vmax = current, imax = 0;
			for (var i = 0; i < values.length; i++)
				if (values[i] > vmax) {
					imax = i;
					vmax = values[i];
				}
			callback(plays[imax].command);
		}
		else callback({ type: "endturn" });
	}

	generatePlays (state) {

		if (!state)
			state = this.gameboard;
		var area = state.areas[this.no];
		var plays = [];

		if (area.choosebox.opened) {
			area.choosebox.cards.forEach(c => plays.push(new Play("choose", c)));
		} else {
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
				c.faculties.forEach((f, i) => {
					if (!f.event.requirement)
						if (c.canUse(f))
							plays.push(new Play("faculty", c, i));
					else area.gameboard.tiles.forEach(t => {
						if (c.canUse(f, t))
							plays.push(new Play("faculty", c, i, t));
					})
				})
				if (c.canAct) {
					area.opposite.field.entities.forEach(e => {
						if (c.canAttack(e)) {
							plays.push(new Play("attack", c, e));
						}
					})
					if (c.canMove) {
						c.location.adjacents.forEach(t => {
							if (c.canMoveOn(t))
								plays.push(new Play("move", c, t));
						})
					}
				}
			})
		}
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

		/*var heuristic = (h, pow, mlt) => Math.pow(h(area), pow) * mlt - Math.pow(h(area.opposite), pow) * mlt;

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

		var hBoardEffect = Math.pow(area.field.entities.filter(e => e.isType("figure")).reduce((acc, e) => acc + effectPower(e), 0), 0.9) * 200;
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
		}, 0), 0.9, 120);

		var hHandSize = heuristic(h => h.hand.count, 0.85, 600);

		var value = hHeroLethal + hHeroHp + hManaReceptacles + hGems + hBoardPresence + hBoardPower + hHeroCover + hBoardCover + hHandSize + hHeroLevel;*/

		var win = new WinHeuristic(state, this.no).compute();
		var hp = new HPHeuristic(state, this.no).compute();
		var mana = new ManaHeuristic(state, this.no).compute();
		var gems = new GemHeuristic(state, this.no).compute();
		var hand = new HandSizeHeuristic(state, this.no).compute();
		var level = new HeroLevelHeuristic(state, this.no).compute();
		var board = new BoardPresenceHeuristic(state, this.no).compute();
		var cover = new CoverHeuristic(state, this.no).compute();

		var value = win * 100 + hp * 3 + mana * 3 + gems + level * 0.6 + hand * 2 + board * 2 + cover;

		return value;
	}
}

module.exports = TrainingAI;