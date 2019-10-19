var Bloc = require('./Bloc');
var Types = require('./Types');

class CountCards extends Bloc {

	constructor (src, ctx) {

		super("countcards", src, ctx);
		this.f = (src, ins) => [ins[0].filter(card => ins[1](src, card)).length];
		this.types = [Types.locations, Types.cardfilter];
	}
}

module.exports = CountCards;