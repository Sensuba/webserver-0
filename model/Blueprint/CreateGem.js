var Bloc = require('./Bloc');
var Types = require('./Types');

class CreateGem extends Bloc {

	constructor (src, ctx) {

		super("creategem", src, ctx, true);
		this.f = (src, ins) => {
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++)
				ins[0].manapool.createGem();
			return [];
		};
		this.types = [Types.area, Types.int];
	}
}

module.exports = CreateGem;