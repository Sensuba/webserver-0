var Bloc = require('./Bloc');
var Types = require('./Types');

class Pilot extends Bloc {

	constructor (src, ctx) {

		super("pilot", src, ctx);
		this.f = (src, ins) => [ins[0].pilot, ins[0].pilot !== null && ins[0].pilot !== undefined];
		this.types = [Types.card];
	}
}

module.exports = Pilot;