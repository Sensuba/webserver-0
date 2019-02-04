var Bloc = require('./Bloc');
var Types = require('./Types');

class CardToTileFilter extends Bloc {

	constructor (src, ctx) {

		super("ctotfilter", src, ctx);
		this.f = (src, ins) => [(src, target) => target.occupied && ins[0](target.card)];
		this.types = [Types.cardfilter];
	}
}

module.exports = CardToTileFilter;