var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareCards extends Bloc {

	constructor (src, ctx) {

		super("cmpcards", src, ctx);
		this.f = (src, ins) => [ins[0].id === ins[1].id, ins[0].cardType === ins[1].cardType, ins[0].area && ins[1].area && ins[0].area.id === ins[1].area.id];
		this.types = [Types.card, Types.card];
	}
}

module.exports = CompareCards;