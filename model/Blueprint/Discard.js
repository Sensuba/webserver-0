var Bloc = require('./Bloc');
var Types = require('./Types');
var Update = require('../Update');

class Discard extends Bloc {

	constructor (src, ctx) {

		super("discard", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].onBoard)
				new Update(() => ins[0].discard(), ins[0].gameboard);
			else
				ins[0].discard();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Discard;