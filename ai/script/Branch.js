var Types = require("./Types");

class Branch {

	constructor (basis) {

		this.condition = Types.bool(basis.condition);
		this.if = basis.if;
		this.else = basis.else;
		this.static = true;
	}

	compute (ctx) {

		var next = () => {

			var res = this.reader.next();
			if (!res)
				delete this.reader;
			return res;
		}

		if (this.reader)
			return next();

		var Reader = require("./Reader");
		this.reader = new Reader(ctx.gameboard, ctx.player, this.condition(ctx) ? this.if : this.else);
		Object.assign(this.reader.variables, ctx.variables);
		this.reader.init();
		return next();
	}
}

module.exports = Branch;