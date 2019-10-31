var Bloc = require('./Bloc');
var Types = require('./Types');

class Overload extends Bloc {

	constructor (src, ctx) {

		super("overload", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].boostoverload(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = Overload;