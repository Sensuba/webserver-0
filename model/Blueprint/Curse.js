var Bloc = require('./Bloc');
var Types = require('./Types');

class Curse extends Bloc {

	constructor (src, ctx) {

		super("curse", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].deck.fatigue();
			return [];
		};
		this.types = [Types.area];
	}
}

module.exports = Curse;