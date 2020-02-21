var Types = require("./Types");

class ForEach {

	constructor (basis) {

		this.area = Types.area(basis.area);
		this.filter = Types.cardfilter(basis.filter);
		this.variable = basis.variable;
		this.do = basis.do;
		this.static = true;
	}

	compute (ctx) {

		if (!this.list) {
			this.list = this.area(ctx).reduce((list, loc) => list.concat(loc.cards), []).filter(this.filter(ctx));
			if (this.list.length <= 0) {
				delete this.list;
				return null;
			}
			this.index = 0;
		}

		if (this.reader) {
			var res = this.reader.next();
			if (res)
				return res;
			delete this.reader;
			if (this.index >= this.list.length) {
				delete this.list;
				delete this.index;
				return null;
			}
		}

		var Reader = require("./Reader");
		this.reader = new Reader(ctx.gameboard, ctx.player, this.do);
		Object.assign(this.reader.variables, ctx.variables);
		this.reader.variables[this.variable] = this.list[this.index++];
		this.reader.init();
		return this.reader.next();
	}
}

module.exports = ForEach;