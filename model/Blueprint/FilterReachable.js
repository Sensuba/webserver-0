var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterReachable extends Bloc {

	constructor (src, ctx) {

		super("filterreachable", src, ctx);
		this.f = (src, ins) => [target => ins[0].canReach(target)];
		this.types = [Types.card];
	}
}

module.exports = FilterReachable;