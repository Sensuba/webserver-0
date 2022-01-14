var Bloc = require('./Bloc');
var Types = require('./Types');

class TriggerEffect extends Bloc {

	constructor (src, ctx) {

		super("trigger", src, ctx, true);
		this.f = (src, ins) => {
			switch (ins[0].type) {
			case "play":
				ins[0].chosen = ins[1];
				ins[2].autocast = true;
				ins[0].trigger(ins[2]);
				ins[2].autocast = false;
				break;
			case "lw":
				ins[0].trigger(ins[2]);
				break;
			default: break;
			}
			return [];
		};
		this.types = [Types.effect, Types.location, Types.card];
	}
}

module.exports = TriggerEffect;