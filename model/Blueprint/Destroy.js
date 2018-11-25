var Bloc = require('./Bloc');
var Types = require('./Types');
var Update = require('../Update');

class Destroy extends Bloc {

	constructor (src, ctx) {

		super("destroy", src, ctx, true);
		this.f = (src, ins) => {
			new Update(() => ins[0].destroy(), ins[0].gameboard);
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Destroy;