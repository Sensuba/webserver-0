var Bloc = require('./Bloc');
var Types = require('./Types');

class Shift extends Bloc {

	constructor (src, ctx) {

		super("shift", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].shift(ins[1], ins[2]);
			return [];
		};
		this.types = [Types.card, Types.model, Types.event];
	}
}

module.exports = Shift;