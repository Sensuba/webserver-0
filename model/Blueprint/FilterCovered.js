var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterCovered extends Bloc {

	constructor (src, ctx) {

		super("filtercovered", src, ctx);
		this.f = (src, ins) => [
			target => target && (ins[0].cover(target) || ins[0].cover(target, true)),
			target => target && ins[0].cover(target),
			target => target && ins[0].cover(target, true)
		];
		this.types = [Types.card];
	}
}

module.exports = FilterCovered;