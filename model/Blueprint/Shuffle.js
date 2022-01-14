var Bloc = require('./Bloc');
var Types = require('./Types');

class Shuffle extends Bloc {

	constructor (src, ctx) {

		super("shuffle", src, ctx, true);
		this.f = (src, ins) => [ins[0].deck.shuffle()];
		this.types = [Types.area];
	}
}

module.exports = Shuffle;