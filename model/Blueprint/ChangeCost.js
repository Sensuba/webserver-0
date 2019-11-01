var Bloc = require('./Bloc');
var Types = require('./Types');

class ChangeCost extends Bloc {

	constructor (src, ctx) {

		super("changecost", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].changeCost(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.int];
	}
}

module.exports = ChangeCost;