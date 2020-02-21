

class Bool {

	constructor (basis) {

		var Types = require("./Types");
		this.card = Types.card(basis.card);
		this.check = Types.cardfilter(basis.check);
	}

	compute (ctx) {

		return this.check(ctx)(this.card(ctx));
	}
}

module.exports = Bool;