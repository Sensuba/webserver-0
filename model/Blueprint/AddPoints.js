var Bloc = require('./Bloc');
var Types = require('./Types');

class AddPoints extends Bloc {

	constructor (src, ctx) {

		super("addpoints", src, ctx);
		this.f = (src, ins) => {
			ins[0].setPoints(ins[0].actionPt + ins[1], ins[0].skillPt + ins[2], ins[0].motionPt + ins[3]);
			return [];
		};
		this.types = [Types.card, Types.int, Types.int, Types.int];
	}
}

module.exports = AddPoints;