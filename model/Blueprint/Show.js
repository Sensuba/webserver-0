var Bloc = require('./Bloc');
var Types = require('./Types');

class Show extends Bloc {

	constructor (src, ctx) {

		super("show", src, ctx, true);
		var Card = require('../Card');
		this.f = (src, ins) => {

			var gen = new Card(ins[0], src.gameboard, src.area.court);
			src.gameboard.notify("show", gen);
			gen.anihilate();
			return [];
		};
		this.types = [Types.model];
	}
}

module.exports = Show;