var Bloc = require('./Bloc');
var Types = require('./Types');

class Set extends Bloc {

	constructor (src, ctx) {

		super("set", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].set(ins[1], ins[2], ins[3], ins[4]);
			return [];
		};
		this.types = [Types.card, Types.int, Types.int, Types.int, Types.int];
	}
}

module.exports = Set;