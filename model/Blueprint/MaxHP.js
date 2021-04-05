var Bloc = require('./Bloc');
var Types = require('./Types');

class MaxHP extends Bloc {

	constructor (src, ctx) {

		super("maxhp", src, ctx);
		this.f = (src, ins) => [ins[0].hp || 0];
		this.types = [Types.card];
	}
}

module.exports = MaxHP;