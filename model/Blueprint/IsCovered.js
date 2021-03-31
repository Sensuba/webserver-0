var Bloc = require('./Bloc');
var Types = require('./Types');

class IsCovered extends Bloc {

	constructor (src, ctx) {

		super("covered", src, ctx);
		this.f = (src, ins) => {
			if (ins[0] && ins[0].isEff)
				ins[0] = ins[0].original;
			return [ins[0] && (ins[0].isCovered(false) || ins[0].isCovered(true)), ins[0] && ins[0].isCovered(false), ins[0] && ins[0].isCovered(true)];
		}
		this.types = [Types.card];
	}
}

module.exports = IsCovered;