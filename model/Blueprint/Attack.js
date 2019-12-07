var Bloc = require('./Bloc');
var Types = require('./Types');

class Attack extends Bloc {

	constructor (src, ctx) {

		super("attack", src, ctx, true);
		this.f = (src, ins) => [ins[0].attack(ins[1])];
		this.types = [Types.card, Types.card];
	}
}

module.exports = Attack;