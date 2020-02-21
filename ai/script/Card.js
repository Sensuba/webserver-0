

class Card {

	constructor (basis) {

		var Types = require("./Types");
		this.location = Types.location(basis.location);
	}

	compute (ctx) {

		var loc = this.location(ctx);
		return loc.cards[0];
	}
}

module.exports = Card;