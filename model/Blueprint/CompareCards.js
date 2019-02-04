var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareCards extends Bloc {

	constructor (src, ctx) {

		super("cmpcards", src, ctx);
		this.f = (src, ins) => [ins[0] === ins[1], ins[0].cardType === ins[1].cardType, ins[0].area && ins[1].area && ins[0].area === ins[1].area];
		this.types = [Types.card, Types.card];
	}
}

module.exports = CompareCards;