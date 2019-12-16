var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterCard extends Bloc {

	constructor (src, ctx) {

		super("filtercard", src, ctx);
		this.f = (src, ins) => [
			target => target && target === ins[0],
			target => target !== ins[0],
			target => target && ins[0] && target.idCardmodel === ins[0].idCardmodel,
			target => target && ins[0] && target.idCardmodel === ins[0].idCardmodel
		];
		this.types = [Types.card];
	}
}

module.exports = FilterCard;