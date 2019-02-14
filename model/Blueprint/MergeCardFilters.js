var Bloc = require('./Bloc');
var Types = require('./Types');

class MergeCardFilters extends Bloc {

	constructor (src, ctx) {

		super("mergecfilters", src, ctx);
		this.f = (src, ins) => [target => (ins[0](target) || ins[1](target)), target => (ins[0](target) && ins[1](target))];
		this.types = [Types.cardfilter, Types.cardfilter];
	}
}

module.exports = MergeCardFilters;