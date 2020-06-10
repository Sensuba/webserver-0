var Types = require("./Types");

class Attack {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.target = Types.card(basis.target);
	}

	compute (ctx) {

		return { type: "attack", id: this.src(ctx).id, target: this.target(ctx).id }
	}
}

module.exports = Attack;