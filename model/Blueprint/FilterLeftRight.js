var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterLeftRight extends Bloc {

	constructor (src, ctx) {

		super("filterlr", src, ctx);
		this.f = (src, ins) => [target => target && target.isLeftRight(ins[0], ins[1])];
		this.types = [Types.bool, Types.bool];
	}
}

module.exports = FilterLeftRight;