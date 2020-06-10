
class Cardfilter {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.and) {
			this.and = Types.array(Types.cardfilter, basis.and);
			this.mode = "and";
		} else if (basis.not) {
			this.not = Types.cardfilter(basis.not);
			this.mode = "not";
		}
		if (basis.name)
			this.name = Types.string(basis.name);
		if (basis.mana)
			this.mana = Types.string(basis.mana);
		if (basis.atk)
			this.atk = Types.int(basis.atk);
		if (basis.hp)
			this.hp = Types.int(basis.hp);
		if (basis.range)
			this.range = Types.int(basis.range);
		if (basis.coverage !== undefined)
			this.coverage = Types.bool(basis.coverage);
		if (basis.flying !== undefined)
			this.flying = Types.bool(basis.flying);
	}

	compute (ctx) {

		switch (this.mode) {
		case "and": return card => this.and.every(filter => filter(ctx)(card));
		case "not": return card => !this.not(ctx)(card);
		default: break;
		}

		if (this.name) var name = this.name(ctx);
		if (this.mana) var mana = this.mana(ctx);
		if (this.atk) var atk = this.atk(ctx);
		if (this.hp) var hp = this.hp(ctx);
		if (this.range) var range = this.range(ctx);
		if (this.coverage !== undefined) var coverage = this.coverage(ctx);
		if (this.flying !== undefined) var flying = this.flying(ctx);

		return card => {

			if (this.name && !(card && card.nameCard && card.nameCard === name))
				return false;

			if (this.mana && !(card && card.mana && card.eff.mana === mana))
				return false;

			if (this.atk && !(card && card.atk && card.eff.atk === atk))
				return false;

			if (this.hp && !(card && card.chp && card.chp === hp))
				return false;

			if (this.range && !(card && card.range && card.eff.range === range))
				return false;

			if (this.coverage && !(card && card.covered === coverage))
				return false;

			if (this.flying && !(card && card.hasState("flying") === flying))
				return false;

			return true;
		}
	}
}

module.exports = Cardfilter;