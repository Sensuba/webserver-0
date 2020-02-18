var Bloc = require('./Bloc');
var Types = require('./Types');

class CanReach extends Bloc {

	constructor (src, ctx) {

		super("canreach", src, ctx);
		this.f = (src, ins) => [ins[0].canReach(ins[1])];
		this.types = [Types.card, Types.card];
	}
}

module.exports = CanReach;