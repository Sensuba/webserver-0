var Bloc = require('./Bloc');
var Types = require('./Types');

class Draw extends Bloc {

	constructor (src, ctx) {

		super("draw", src, ctx, true);
		this.f = (src, ins) => [ins[1].draw(ins[0])];
		this.types = [Types.int, Types.area];
	}
}

module.exports = Draw;