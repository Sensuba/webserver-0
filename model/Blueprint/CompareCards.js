var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareCards extends Bloc {

	constructor (src, ctx) {

		super("cmpcards", src, ctx);
		this.f = (src, ins) => {
			if (!ins[0] || !ins[1])
				return [false, false, false];
			return [ins[0].equals(ins[1]), ins[0].cardType === ins[1].cardType, ins[0].area && ins[1].area && ins[0].area.id === ins[1].area.id];
		}
		this.types = [Types.card, Types.card];
	}
}

module.exports = CompareCards;