var Bloc = require('./Bloc');
var Types = require('./Types');

class Max extends Bloc {

	constructor (src, ctx) {

		super("opmax", src, ctx);
		this.f = (src, ins) => [Math.max(ins[0], ins[1])];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Max;