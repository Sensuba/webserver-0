var Faculty = require("./Faculty");

class Skill extends Faculty {

	constructor (event, mana, text) {

		super(event, src => src.skillPt-- & src.area.manapool.use(mana), text);
		this.mana = mana;
	}

	canBeUsed (src, target) {

		return src.skillPt > 0 && !src.frozen && src.area && src.area.manapool.usableMana >= this.mana && (!this.event.requirement || this.event.requirement(src, target));
	}
}

module.exports = Skill;