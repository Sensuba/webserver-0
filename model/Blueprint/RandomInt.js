var Bloc = require('./Bloc');
var Types = require('./Types');

class RandomInt extends Bloc {

	constructor (src, ctx) {

		super("randint", src, ctx);
		this.f = (src, ins) => {
			var min = ins[0] || 0, max = ins[1] === 0 ? 0 : (ins[1] || 2147483647);
			return [Math.floor(min + Math.random()*(max+1))];
		};
		this.types = [Types.int, Types.int];
	}
}

module.exports = RandomInt;