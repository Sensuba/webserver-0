var Bloc = require('./Bloc');
var Types = require('./Types');

class MergeModelFilters extends Bloc {

	constructor (src, ctx) {

		super("mergemfilters", src, ctx);
		this.f = (src, ins) => [target => (ins[0](target) || ins[1](target)), target => (ins[0](target) && ins[1](target))];
		this.types = [Types.modelfilter, Types.modelfilter];
	}
}

module.exports = MergeModelFilters;