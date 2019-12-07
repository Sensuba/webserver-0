var Bloc = require('./Bloc');
var Types = require('./Types');

class Poisoned extends Bloc {

	constructor (src, ctx) {

		super("poisoned", src, ctx, true);
		this.f = (src, ins) => [ins[0].poisoned, ins[0].poisondmg || 0];
		this.types = [Types.card];
	}
}

module.exports = Poisoned;