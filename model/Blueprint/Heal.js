var Bloc = require('./Bloc');
var Types = require('./Types');

class Heal extends Bloc {

	constructor (src, ctx) {

		super("heal", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].heal(ins[2], ins[1]);
			return [];
		};
		this.types = [Types.card, Types.card, Types.int];
	}
}

module.exports = Heal;