var Bloc = require('./Bloc');
var Types = require('./Types');

class CountCards extends Bloc {

	constructor (src, ctx) {

		super("countcards", src, ctx);
		this.f = (src, ins) => [ins[0].reduce((count, loc) => count + loc.cards.filter(card => !ins[1] || ins[1](card, src)).length, 0)];
		this.types = [Types.locations, Types.cardfilter];
	}
}

module.exports = CountCards;