var Types = require("./Types");

class Faculty {

	constructor (basis) {

		this.src = Types.card(basis.src);
		this.index = Types.int(basis.value);
	}

	compute (ctx) {

		return { type: "faculty", id: this.src(ctx).id, faculty: this.index(ctx) }
	}
}

module.exports = Faculty;