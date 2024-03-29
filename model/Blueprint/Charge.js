var Bloc = require('./Bloc');
var Types = require('./Types');

class Charge extends Bloc {

	constructor (src, ctx) {

		super("charge", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].mecha && ins[0].isType("artifact"))
				ins[0].chargeMech(ins[1])
			else
				ins[0].charge(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = Charge;