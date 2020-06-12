
var Heuristic = require("./Heuristic");

class BoardPresenceHeuristic extends Heuristic {

	constructor (board, no) {

		super(board, no);
		this.halfvalue = 3500;
		this.egoism = -0.3;
	}

	evaluate () {

		var count = 0, effectValue = 0, atkValue = 0, hpValue = 0;

		this.area.field.entities.forEach(e => {

			if (e.isType("hero"))
				return;

			count += e.isType("artifact") ? 2/5 : 1;

			["initiative", "exaltation", "fury", "immune", "concealed", "lethal", "cover neighbors"].forEach(state => { if (e.hasState(state)) effectValue++; });
			if (e.shield)
				hpValue += 400;

			if (e.atk)
				atkValue += e.eff.atk;
			if (e.chp)
				hpValue += e.isType("artifact") ? e.chp/4 : e.chp;
		})

		return atkValue + hpValue + (atkValue*hpValue/3000) + effectValue * 400 + count * 500;
	}
}

module.exports = BoardPresenceHeuristic;