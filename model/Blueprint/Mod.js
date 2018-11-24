var Bloc = require('./Bloc');
var Types = require('./Types');

class Mod extends Bloc {

	constructor (src, ctx) {

		super("opmod", src, ctx);
		this.f = (src, ins) => [ins[0] % ins[1]];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Mod;