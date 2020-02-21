var Types = require("./Types");

class Branch {

	constructor (basis) {

		this.condition = Types.bool(basis.condition);
		this.if = basis.if;
		this.else = basis.else;
		this.static = true;
	}

	compute (ctx) {

		if (this.reader) {
			var res = this.reader.next();
			if (!res)
				delete this.reader;
			return res;
		}

		var Reader = require("./Reader");
		this.reader = new Reader(ctx.gameboard, ctx.player, this.condition(ctx) ? this.if : this.else);
		Object.assign(this.reader.variables, ctx.variables);
		this.reader.init();
		return this.reader.next();
	}
}

module.exports = Branch;