var Bloc = require('./Bloc');
var Types = require('./Types');

class Charge extends Bloc {

	constructor (src, ctx) {

		super("charge", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].charge(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = Charge;