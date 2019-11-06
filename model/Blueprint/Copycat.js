var Bloc = require('./Bloc');
var Types = require('./Types');

class Copycar extends Bloc {

	constructor (src, ctx) {

		super("copy", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].copy(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.card];
	}
}

module.exports = Copycar;