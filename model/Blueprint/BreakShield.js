var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakShield extends Bloc {

	constructor (src, ctx) {

		super("breakshield", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].breakShield();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = BreakShield;