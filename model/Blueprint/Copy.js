var Bloc = require('./Bloc');
var Types = require('./Types');

class Copy extends Bloc {

	constructor (src, ctx) {

		super("newcopy", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins) => {
			if (ins[0] && ins[0].hasState("glazed") && ins[2] && ins[2].id.locationOrder <= 2)
				return [null];
			var gen;
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++) {
				gen = new Card(ins[0].model, src.gameboard, ins[2]);
				if (ins[0].location && gen.location && ins[0].location.locationOrder <= gen.location.locationOrder)
					gen.copy(ins[0], ins[3]);
				else {
					gen.transform(ins[0].model);
					if (ins[3])
						gen.setState("glazed", true);
				}
			}
			return [gen];
		};
		this.types = [Types.card, Types.int, Types.location, Types.bool];
	}
}

module.exports = Copy;