
var Heuristic = require("./Heuristic");

class CoverHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 3800;
		this.egoism = 0.3;
	}

	evaluate () {

		var gthreaths = 200, athreaths = 200, figcover = 0, herocover = 0, adjacents = 0;
		var breakpoints = [];

		var evaluateFigure = f => {

			var evalue = f.eff.atk + f.chp;
			["initiative", "exaltation", "fury", "immune", "concealed", "lethal", "cover neighbors"].forEach(state => { if (f.hasState(state)) evalue += 300; });
			return evalue;
		}

		this.area.opposite.field.entities.forEach(e => {

			if (e.isType("artifact"))
				return;
			var threat = e.eff.atk;
			if (e.hasState("lethal"))
				threat = Math.max(threat, 1000);
			["initiative", "fury", "immune"].forEach(state => { if (e.hasState(state)) threat += 200; });
			if (e.isType("hero"))
				threat *= 0.6;
			if (e.hasState("flying"))
				athreaths += threat;
			else gthreaths += threat;

			if (e.isType("hero"))
				return;
			var evalue = evaluateFigure(e);
			breakpoints.push({ atk: e.hasState("lethal") ? 10000 : e.eff.atk, hp: e.chp, value: evalue, flying: e.hasState("flying") });
		})

		this.area.field.entities.forEach(e => {

			adjacents += e.location.adjacents.length;

			if (e.isType("hero"))
				return;

			if (e.hasState("concealed")) {
				figcover += gthreaths/2 + athreaths/2;
				return;
			}

			if (e.cover(this.area.hero))
				herocover += (e.chp + 500) * gthreaths/500;
			else if (e.cover(this.area.hero, true))
				herocover += (e.chp + 500) * athreaths/500;

			var covervalue = 1;
			["initiative", "fury", "exaltation"].forEach(state => { if (e.hasState(state)) covervalue += 0.5; });
			if (e.eff.range > 1)
				covervalue += e.eff.range;

			if (e.isCovered())
				figcover += gthreaths/2.5;
			if (e.isCovered(true))
				figcover += athreaths/2.5;

			breakpoints.forEach(b => {
				if (!e.shield && b.atk >= e.chp && (b.hp > e.eff.atk || !e.hasState("lethal"))) {
					var evalue = evaluateFigure(e);
					if (evalue > b.value && !e.isCovered(b.flying))
						figcover += b.value - evalue;
				}
			})
		})
		herocover = (1 - this.area.hero.chp/(this.area.hero.hp+500)) * herocover + adjacents * 50;

		return figcover + herocover;
	}
}

module.exports = CoverHeuristic;