var Bloc = require('./Bloc');
var Types = require('./Types');

class Times extends Bloc {

	constructor (src, ctx) {

		super("optimes", src, ctx);
		this.f = (src, ins) => [ins[0] * ins[1]];
		this.types = [Types.int, Types.int];
	}
}

module.exports = Times;