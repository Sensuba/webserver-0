var Bloc = require('./Bloc');
var Types = require('./Types');

class RefillMana extends Bloc {

	constructor (src, ctx) {

		super("createmana", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].manapool.refill(ins[1]);
			return [];
		};
		this.types = [Types.area, Types.int, Types.bool];
	}
}

module.exports = RefillMana;