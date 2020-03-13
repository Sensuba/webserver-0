var Types = require("./Types");

class Play {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.value = Types.array(Types.location, basis.value);
	}

	compute (ctx) {

		var targets = this.value.map(v => {
			var vctx = v(ctx);
			return vctx ? vctx.id : null;
		}).filter(v => v);

		return { type: "play", id: this.src(ctx).id, targets }
	}
}

module.exports = Play;