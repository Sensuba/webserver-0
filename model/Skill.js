var Faculty = require("./Faculty");

class Skill extends Faculty {

	constructor (event, mana) {

		super(event, src => src.skillPt-- & src.area.manapool.use(mana));
		this.mana = mana;
	}

	canBeUsed (src, target) {

		return src.skillPt > 0 && src.area && src.area.manapool.usableMana >= this.mana && (!this.event.requirement || this.event.requirement(src, target));
	}
}

module.exports = Skill;