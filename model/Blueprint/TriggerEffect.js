var Bloc = require('./Bloc');
var Types = require('./Types');

class TriggerEffect extends Bloc {

	constructor (src, ctx) {

		super("trigger", src, ctx, true);
		this.f = (src, ins) => {
			switch (ins[0].effecttype) {
			case "last will":
				ins[0].trigger("trigger", ins[2]);
				break;
			default: break;
			}
			return [];
		};
		this.types = [Types.innereffect, Types.location, Types.card];
	}
}

module.exports = TriggerEffect;