
class Cardfilter {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.and) {
			this.and = Types.array(Types.cardfilter, basis.and);
			this.mode = "and";
		}
		if (basis.name)
			this.name = Types.string(basis.name);
		if (basis.atk)
			this.atk = Types.int(basis.atk);
		if (basis.hp)
			this.hp = Types.int(basis.hp);
		if (basis.range)
			this.range = Types.int(basis.range);
		if (basis.coverage !== undefined)
			this.coverage = Types.bool(basis.coverage);
	}

	compute (ctx) {

		if (this.mode === "and")
			return card => this.and.every(filter => filter(ctx)(card));

		if (this.name) var name = this.name(ctx);
		if (this.atk) var atk = this.atk(ctx);
		if (this.hp) var hp = this.hp(ctx);
		if (this.range) var range = this.range(ctx);
		if (this.coverage !== undefined) var coverage = this.coverage(ctx);

		return card => {

			if (this.name && !(card && card.nameCard && card.nameCard === name))
				return false;

			if (this.atk && !(card && card.atk && card.atk === atk))
				return false;

			if (this.hp && !(card && card.chp && card.chp === hp))
				return false;

			if (this.range && !(card && card.range && card.range === range))
				return false;

			if (this.coverage && !(card && card.covered === coverage))
				return false;

			return true;
		}
	}
}

module.exports = Cardfilter;