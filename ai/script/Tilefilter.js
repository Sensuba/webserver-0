
class Tilefilter {

	constructor (basis) {

		var Types = require("./Types");
		this.atk = Types.int(basis.atk);
	}

	compute (ctx) {

		var atk = this.atk(ctx);

		return tile => tile && tile.occupied && tile.card.atk && tile.card.atk === atk;
	}
}

module.exports = Tilefilter;