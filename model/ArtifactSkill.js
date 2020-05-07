var Faculty = require("./Faculty");

class ArtifactSkill extends Faculty {

	constructor (event, durability, text) {

		super(event, src => src.skillPt-- & (durability > 0 ? src.heal(durability, src) : src.damage(-durability, src)), text);
		this.durability = durability;
	}

	canBeUsed (src, target) {

		return src.skillPt > 0 && !src.frozen && src.area && src.eff.chp >= -this.durability && (!this.event.requirement || this.event.requirement(src, target));
	}
}

module.exports = ArtifactSkill;