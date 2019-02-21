var Bloc = require('./Bloc');
var Types = require('./Types');

class Summon extends Bloc {

	constructor (src, ctx) {

		super("summon", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].summon(ins[1])
			return [];
		};
		this.types = [Types.card, Types.location];
	}
}

module.exports = Summon;