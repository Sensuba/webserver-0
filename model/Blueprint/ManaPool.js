var Bloc = require('./Bloc');
var Types = require('./Types');

class ManaPool extends Bloc {

	constructor (src, ctx) {

		super("manapool", src, ctx);
		this.f = (src, ins) => [ins[0].manapool.mana, ins[0].manapool.maxMana, ins[0].manapool.gems];
		this.types = [Types.area];
	}
}

module.exports = ManaPool;