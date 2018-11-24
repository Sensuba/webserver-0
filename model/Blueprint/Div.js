var Bloc = require('./Bloc');
var Types = require('./Types');

class Div extends Bloc {

	constructor (src, ctx) {

		super("opdiv", src, ctx);
		this.f = (src, ins) => [Math.floor(ins[0] / ins[1])];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Div;