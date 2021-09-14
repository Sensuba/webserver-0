var Bloc = require('./Bloc');
var Types = require('./Types');

class Points extends Bloc {

	constructor (src, ctx) {

		super("points", src, ctx);
		this.f = (src, ins) => [ins[0].actionPt || 0, ins[0].skillPt || 0, ins[0].motionPt || 0];
		this.types = [Types.card];
	}
}

module.exports = Points;