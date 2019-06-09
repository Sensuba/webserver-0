var Bloc = require('./Bloc');
var Types = require('./Types');

class Freeze extends Bloc {

	constructor (src, ctx) {

		super("freeze", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].freeze();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Freeze;