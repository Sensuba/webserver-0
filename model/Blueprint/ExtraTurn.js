var Bloc = require('./Bloc');
var Types = require('./Types');

class ExtraTurn extends Bloc {

	constructor (src, ctx) {

		super("extraturn", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].extraTurn();
			return [];
		};
		this.types = [Types.area];
	}
}

module.exports = ExtraTurn;