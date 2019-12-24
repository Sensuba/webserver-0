var Bloc = require('./Bloc');
var Types = require('./Types');

class PutFirstLast extends Bloc {

	constructor (src, ctx) {

		super("putfl", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].goto(ins[1]);
			var c = ins[3] || 0;
			if (ins[1].cards) {
				var p = ins[2] ? Math.min(c, ins[1].count-1) : Math.max(0, ins[1].count-1-c);
				ins[1].cards = ins[1].cards.filter (el => el !== ins[0]);
				ins[1].cards.splice(p, 0, ins[0]);
			}
			return [];
		}
		this.types = [Types.card, Types.location, Types.bool, Types.int];
	}
}

module.exports = PutFirstLast;