var Bloc = require('./Bloc');
var Types = require('./Types');

class Generate extends Bloc {

	constructor (src, ctx) {

		super("generate", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins) => {
			var gen;
			var n = ins[1] === null ? 1 : ins[1];
			for (var i = 0; i < n; i++) {
				gen = new Card(ins[0], src.gameboard, ins[2]);
			}
			return [gen];
		};
		this.types = [Types.model, Types.int, Types.location];
	}
}

module.exports = Generate;