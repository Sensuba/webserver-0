var Bloc = require('./Bloc');
var Types = require('./Types');

class TriggerSecret extends Bloc {

	constructor (src, ctx) {

		super("triggersecret", src, ctx, true);
		this.f = (src, ins) => {
			if (!ins[0].location.area.isPlaying && ins[0].onBoard && ins[0].canBePaid) {
				ins[0].innereffects.forEach(e => {
					if (e.type === "secret")
						e.activate(ins[1]);
				});
			}
			return [];
		};
		this.types = [Types.card, Types.data];
	}
}

module.exports = TriggerSecret;