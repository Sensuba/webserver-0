var Bloc = require('./Bloc');
var Types = require('./Types');
var Update = require('../Update');

class Destroy extends Bloc {

	constructor (src, ctx) {

		super("destroy", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].onBoard)
				new Update(() => ins[0].destroy(), ins[0].gameboard);
			else
				ins[0].destroy();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Destroy;