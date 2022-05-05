var Bloc = require('./Bloc');
var Types = require('./Types');

class GetColors extends Bloc {

	constructor (src, ctx) {

		super("getcolors", src, ctx);
		this.f = (src, ins) => [card => card.idColor === ins[0].idColor || (card.isType("hero") && card.idColor2 === ins[0].idColor), card => card.idColor === ins[0].idColor2 || (card.isType("hero") && card.idColor2 === ins[0].idColor2)];
		this.types = [Types.card];
	}
}

module.exports = GetColors;