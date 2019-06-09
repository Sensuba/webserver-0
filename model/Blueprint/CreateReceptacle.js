var Bloc = require('./Bloc');
var Types = require('./Types');

class CreateReceptacle extends Bloc {

	constructor (src, ctx) {

		super("createreceptacle", src, ctx, true);
		this.f = (src, ins) => {
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++)
				ins[0].manapool.createReceptacle(ins[2]);
			return [];
		};
		this.types = [Types.area, Types.int, Types.bool];
	}
}

module.exports = CreateReceptacle;