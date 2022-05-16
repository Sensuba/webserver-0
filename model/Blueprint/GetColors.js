var Bloc = require('./Bloc');
var Types = require('./Types');

class GetColors extends Bloc {

	constructor (src, ctx) {

		super("getcolors", src, ctx);
		this.f = (src, ins) => [ins[0].idColor, ins[0].idColor2 || null];
		this.types = [Types.card];
	}
}

module.exports = GetColors;