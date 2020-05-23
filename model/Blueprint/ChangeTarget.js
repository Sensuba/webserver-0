var Bloc = require('./Bloc');
var Types = require('./Types');

class ChangeTarget extends Bloc {

	constructor (src, ctx) {

		super("changetarget", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0] && ins[1])
				ins[0].changeTarget(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.location];
	}
}

module.exports = ChangeTarget;