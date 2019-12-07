var Bloc = require('./Bloc');
var Types = require('./Types');

class Poison extends Bloc {

	constructor (src, ctx) {

		super("poison", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].poison(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = Poison;