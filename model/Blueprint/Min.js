var Bloc = require('./Bloc');
var Types = require('./Types');

class Min extends Bloc {

	constructor (src, ctx) {

		super("opmin", src, ctx);
		this.f = (src, ins) => [Math.min(ins[0], ins[1])];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Min;