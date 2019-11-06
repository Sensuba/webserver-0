var Bloc = require('./Bloc');
var Types = require('./Types');

class Copy extends Bloc {

	constructor (src, ctx) {

		super("newcopy", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins) => {
			var gen;
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++) {
				gen = new Card(ins[0].model, src.gameboard, ins[2]);
				gen.copy(ins[0], ins[3])
			}
			return [gen];
		};
		this.types = [Types.card, Types.int, Types.location, Types.bool];
	}
}

module.exports = Copy;