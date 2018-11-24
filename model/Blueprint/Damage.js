var Bloc = require('./Bloc');
var Types = require('./Types');

class Damage extends Bloc {

	constructor (src, ctx) {

		super("damage", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].damage(ins[2], ins[1]);
			return [];
		};
		this.types = [Types.card, Types.card, Types.int];
	}
}

module.exports = Damage;