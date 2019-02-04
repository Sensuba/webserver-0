var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakModel extends Bloc {

	constructor (src, ctx) {

		super("brkmodel", src, ctx);
		this.f = (src, ins) => [ins[0].cardType, ins[0].mana, ins[0].atk, ins[0].hp, ins[0].range];
		this.types = [Types.model];
	}
}

module.exports = BreakModel;