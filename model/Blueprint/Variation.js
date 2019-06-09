var Bloc = require('./Bloc');
var Types = require('./Types');

class Variation extends Bloc {

	constructor (src, ctx) {

		super("variation", src, ctx, true);
		this.f = (src, ins) => [ x => {
			if (ins[0])
				x.mana += ins[0];
			if (ins[1])
				x.atk += ins[1];
			if (ins[2])
				x.hp += ins[2];
			if (ins[3])
				x.range += ins[3];
			return x;
		}];
		this.types = [Types.int, Types.int, Types.int, Types.int, Types.int];
	}
}

module.exports = Variation;