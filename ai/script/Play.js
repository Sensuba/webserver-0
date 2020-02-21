var Types = require("./Types");

class Play {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.value = Types.array(Types.location, basis.value);
	}

	compute (ctx) {

		return { type: "play", id: this.src(ctx).id, targets: this.value.map(v => v(ctx).id) }
	}
}

module.exports = Play;