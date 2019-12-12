var Bloc = require('./Bloc');
var Types = require('./Types');

class CurePoison extends Bloc {

	constructor (src, ctx) {

		super("curepoison", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].curePoison(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = CurePoison;