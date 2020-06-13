var Bloc = require('./Bloc');
var Types = require('./Types');

class Blink extends Bloc {

	constructor (src, ctx) {

		super("blink", src, ctx, true);
		this.f = (src, ins) => {

			src.gameboard.notify("blink", ins[0]);
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Blink;