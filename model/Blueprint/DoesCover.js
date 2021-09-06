var Bloc = require('./Bloc');
var Types = require('./Types');

class DoesCover extends Bloc {

	constructor (src, ctx) {

		super("cover", src, ctx);
		this.f = (src, ins) =>  {
			if (!ins[0] || !ins[1])
				return [false, false, false];
			var card = ins[0].original || ins[0];
			return [card.cover(ins[1], false) || card.cover(ins[1], true), card.cover(ins[1], false), card.cover(ins[1], true)];
		}
		this.types = [Types.card, Types.card];
	}
}

module.exports = DoesCover;