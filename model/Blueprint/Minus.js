var Bloc = require('./Bloc');
var Types = require('./Types');

class Minus extends Bloc {

	constructor (src, ctx) {

		super("opminus", src, ctx);
		this.f = (src, ins) => [ins[0] - ins[1]];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Minus;