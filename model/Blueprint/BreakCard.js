var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakCard extends Bloc {

	constructor (src, ctx) {

		super("brkcard", src, ctx);
		this.f = (src, ins) => [ins[0].model, ins[0].location, ins[0].area, ins[0].cardType, ins[0].eff ? ins[0].eff.mana : ins[0].mana, ins[0].eff ? ins[0].eff.atk : ins[0].atk, ins[0].chp || ins[0].hp, ins[0].eff ? ins[0].eff.range : ins[0].range, ins[0].eff ? ins[0].eff.overload : ins[0].eff.overload, ins[0].damaged, ins[0].destroyed || ins[0].isGhost];
		this.types = [Types.card];
	}
}

module.exports = BreakCard;