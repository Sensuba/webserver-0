var Bloc = require('./Bloc');
var Types = require('./Types');

class Move extends Bloc {

	constructor (src, ctx) {

		super("move", src, ctx, true);
		this.f = (src, ins, image) => {
			ins[0].goto(ins[1]);
			return [];
		}
		this.types = [Types.card, Types.location];
	}
}

module.exports = Move;