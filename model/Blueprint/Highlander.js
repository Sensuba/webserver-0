var Bloc = require('./Bloc');
var Types = require('./Types');

class Highlander extends Bloc {

	constructor (src, ctx) {

		super("highlander", src, ctx);
		this.f = (src, ins) => [ins[0].deck.highlander];
		this.types = [Types.area];
	}
}

module.exports = Highlander;