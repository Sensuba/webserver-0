var Bloc = require('./Bloc');
var Types = require('./Types');

class Activate extends Bloc {

	constructor (src, ctx) {

		super("activate", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].mecha && ins[0].isType("artifact"))
				ins[0].activateMech()
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Activate;