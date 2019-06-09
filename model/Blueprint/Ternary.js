var Bloc = require('./Bloc');
var Types = require('./Types');

class Ternary extends Bloc {

	constructor (src, ctx) {

		super("opter", src, ctx);
		this.f = (src, ins) => {
			return [ins[0] ? ins[1] : ins[2]];
		}
		this.types = [Types.bool, Types.int, Types.int];
	}
}

module.exports = Ternary;