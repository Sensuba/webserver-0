var Bloc = require('./Bloc');
var Types = require('./Types');

class LoadPilot extends Bloc {

	constructor (src, ctx) {

		super("loadpilot", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].mecha && ins[0].isType("artifact") && !ins[0].pilot && ins[1].isType("figure") && !ins[1].mecha)
				ins[0].loadPilot(ins[1])
			return [];
		};
		this.types = [Types.card, Types.card];
	}
}

module.exports = LoadPilot;