var Bloc = require('./Bloc');
var Types = require('./Types');

class ChargeCount extends Bloc {

	constructor (src, ctx) {

		super("chargecount", src, ctx);
		this.f = (src, ins) => [ins[0].mecha && ins[0].isType("artifact") ? (ins[0].activationPt || 0) : (ins[0].charges || 0)];
		this.types = [Types.card];
	}
}

module.exports = ChargeCount;