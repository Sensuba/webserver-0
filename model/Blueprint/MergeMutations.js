var Bloc = require('./Bloc');
var Types = require('./Types');

class MergeMutations extends Bloc {

	constructor (src, ctx) {

		super("mergemutations", src, ctx);
		this.f = (src, ins) => [x => ins[1](ins[0](x))];
		this.types = [Types.mutation, Types.mutation];
	}
}

module.exports = MergeMutations;