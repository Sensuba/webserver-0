var Bloc = require('./Bloc');
var Types = require('./Types');

class CardVariable extends Bloc {

	constructor (src, ctx) {

		super("cardvar", src, ctx);
		this.f = (src, ins) => [(ins[1] || src).getVariable(ins[0]), (ins[1] || src).getVariable(ins[0]) !== undefined];
		this.types = [Types.string, Types.card];
	}
}

module.exports = CardVariable;