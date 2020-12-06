var Bloc = require('./Bloc');
var Types = require('./Types');

class CheckLeftRight extends Bloc {

	constructor (src, ctx) {

		super("checklr", src, ctx);
		this.f = (src, ins) => [ins[0].horizontalPosition < ins[1].horizontalPosition];
		this.types = [Types.location, Types.location];
	}
}

module.exports = CheckLeftRight;