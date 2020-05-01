var Bloc = require('./Bloc');
var Types = require('./Types');

class BaseStats extends Bloc {

	constructor (src, ctx) {

		super("brkcard", src, ctx);
		this.f = (src, ins) => [ins[0].mana, ins[0].atk, Math.min(ins[0].chp, ins[0].hp), ins[0].range, ins[0].overload];
		this.types = [Types.card];
	}
}

module.exports = BaseStats;