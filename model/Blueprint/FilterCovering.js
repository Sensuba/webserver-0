var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterCovering extends Bloc {

	constructor (src, ctx) {

		super("filtercovering", src, ctx);
		this.f = (src, ins) => [
			target => target && (target.cover(ins[0]) || ins[0].cover(ins[0], true)),
			target => target && target.cover(ins[0]),
			target => target && target.cover(ins[0], true)
		];
		this.types = [Types.card];
	}
}

module.exports = FilterCovering;