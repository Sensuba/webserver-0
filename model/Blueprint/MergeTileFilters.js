var Bloc = require('./Bloc');
var Types = require('./Types');

class MergeTileFilters extends Bloc {

	constructor (src, ctx) {

		super("mergetfilters", src, ctx);
		this.f = (src, ins) => [(src, target) => (ins[0](src, target) || ins[1](src, target)), (src, target) => (ins[0](src, target) && ins[1](src, target))];
		this.types = [Types.tilefilter, Types.tilefilter];
	}
}

module.exports = MergeTileFilters;