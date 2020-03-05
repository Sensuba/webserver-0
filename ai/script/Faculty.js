var Types = require("./Types");

class Faculty {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.index = Types.int(basis.value);
		if (basis.target)
			this.target = Types.card(basis.target);
	}

	compute (ctx) {

		if (this.target)
			return { type: "faculty", id: this.src(ctx).id, faculty: this.index(ctx), target: this.target(ctx).id }
		return { type: "faculty", id: this.src(ctx).id, faculty: this.index(ctx) }
	}
}

module.exports = Faculty;