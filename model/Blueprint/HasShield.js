var Bloc = require('./Bloc');
var Types = require('./Types');

class HasShield extends Bloc {

	constructor (src, ctx) {

		super("hasshield", src, ctx);
		this.f = (src, ins) => [ins[0] ? ins[0].shield : false, card => card.shield];
		this.types = [Types.card];
	}
}

module.exports = HasShield;