var Bloc = require('./Bloc');
var Types = require('./Types');

class SkipTurn extends Bloc {

	constructor (src, ctx) {

		super("skipturn", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[0].isPlaying)
				ins[0].endTurn();
			return [];
		};
		this.types = [Types.area];
	}
}

module.exports = SkipTurn;