var Bloc = require('./Bloc');
var Types = require('./Types');

class Level extends Bloc {

	constructor (src, ctx) {

		super("level", src, ctx);
		this.f = (src, ins) => [ins[0].level || 0];
		this.types = [Types.card];
	}
}

module.exports = Level;