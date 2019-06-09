var Bloc = require('./Bloc');
var Types = require('./Types');

class AddShield extends Bloc {

	constructor (src, ctx) {

		super("addshield", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].addShield();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = AddShield;