
class Cardfilter {

	constructor (basis) {

		var Types = require("./Types");
		this.atk = Types.int(basis.atk);
	}

	compute (ctx) {

		var atk = this.atk(ctx);

		return card => card && card.atk && card.atk === atk;
	}
}

module.exports = Cardfilter;