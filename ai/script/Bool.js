

class Bool {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.and) {
			this.and = Types.array(Types.bool, basis.and);
			this.mode = "and";
		} else if (basis.or) {
			this.or = Types.array(Types.bool, basis.or);
			this.mode = "or";
		} else if (basis.card && basis.check) {
			this.card = Types.card(basis.card);
			this.check = Types.cardfilter(basis.check);
			this.mode = "checkcard";
		} else if (basis.card) {
			this.card = Types.card(basis.card);
			this.mode = "cardexists";
		}else if (basis.location) {
			this.location = Types.location(basis.location);
			this.mode = "locexists";
		}
	}

	compute (ctx) {

		switch (this.mode) {
		case "and": return this.and.every(bool => bool(ctx));
		case "or": return this.or.some(bool => bool(ctx));
		case "cardexists": return this.card(ctx) !== null;
		case "checkcard": return this.check(ctx)(this.card(ctx));
		case "locexists": return this.location(ctx) !== null;
		default: return true;
		}
	}
}

module.exports = Bool;