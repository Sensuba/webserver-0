var Types = require("./Types");

class Attack {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.to = Types.location(basis.to);
	}

	compute (ctx) {

		return { type: "move", id: this.src(ctx).id, to: this.to(ctx).id }
	}
}

module.exports = Attack;