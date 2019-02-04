var Bloc = require('./Bloc');
var Types = require('./Types');

class Draw extends Bloc {

	constructor (src, ctx) {

		super("draw", src, ctx, true);
		this.f = (src, ins) => [ins[1].draw(ins[0], ins[2])];
		this.types = [Types.int, Types.area, Types.cardfilter];
	}
}

module.exports = Draw;