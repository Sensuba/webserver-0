var Bloc = require('./Bloc');
var Types = require('./Types');

class Color extends Bloc {

	constructor (src, ctx) {

		super("color", src, ctx);
		this.f = (src, ins) => [card => card.idColor === ins[0] || (card.isType("hero") && card.idColor2 === ins[0]), model => model.idColor === ins[0] || (model.cardType === "hero" && model.idColor2 === ins[0])];
		this.types = [Types.color];
	}
}

module.exports = Color;